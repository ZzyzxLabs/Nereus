#!/bin/bash

# 設定顏色
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. 切換到專案根目錄
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
cd "$PROJECT_ROOT" || exit

# 2. 讀取 .env
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo -e "${RED}❌ 找不到 .env 檔案，無法取得 UpgradeCap ID。${NC}"
    exit 1
fi

# 3. 檢查 UpgradeCap
if [ -z "$UPGRADE_CAP_ID" ]; then
    echo -e "${RED}❌ 錯誤：.env 中找不到 UPGRADE_CAP_ID${NC}"
    echo "請手動將 UpgradeCap ID 加入 .env 檔案中，格式: UPGRADE_CAP_ID=0x..."
    exit 1
fi

echo -e "${BLUE}=== Sui Package Upgrade Tool (Safe Mode) ===${NC}"
echo "Original Package ID : $PACKAGE_ID"
echo "Upgrade Cap ID      : $UPGRADE_CAP_ID"
echo "Current Address     : $(sui client active-address)"
echo "----------------------------------------"

# 4. 提醒
echo -e "${YELLOW}⚠️  升級前檢查事項：${NC}"
echo "1. 請確保 sources/ 中的程式碼已修改。"
echo "2. 請確保 Move.toml 中的 [package] 區塊包含 'published-at = \"$PACKAGE_ID\"'"
echo "3. 請確保 Move.toml 中的 [addresses] 區塊設定為 'nereus = \"$PACKAGE_ID\"'"
echo "----------------------------------------"
read -p "確認已設定 Move.toml? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo "已取消升級。"
    exit 0
fi

# 5. 清洗輸出的函數
clean_output() {
    sed 's/\x1b\[[0-9;]*m//g' | grep -v "warning" | grep -v "Client/Server"
}

# 6. 執行升級
echo -e "${YELLOW}正在編譯並發送升級交易 (Policy: compatible)...${NC}"

# 注意：這裡我們捕獲所有輸出
RAW_RES=$(sui client upgrade \
    --upgrade-capability $UPGRADE_CAP_ID \
    --gas-budget 1000000000 \
    --skip-dependency-verification \
    --json 2>&1 | clean_output)

# 7. 關鍵修正：檢查輸出是否為 JSON
# 如果開頭不是 '{'，代表 CLI 報錯了 (編譯失敗或驗證失敗)
if [[ ${RAW_RES:0:1} != "{" ]]; then
    echo -e "${RED}❌ 升級指令執行失敗！(非交易錯誤)${NC}"
    echo "----------------------------------------"
    echo "詳細錯誤訊息："
    echo "$RAW_RES"
    echo "----------------------------------------"
    echo "常見原因："
    echo "1. Move 編譯錯誤 (請先執行 'sui move build' 檢查)"
    echo "2. 升級相容性驗證失敗 (例如修改了現有 struct 或 function 簽名)"
    echo "3. Move.toml 設定錯誤 (published-at 未設定)"
    exit 1
fi

# 8. 如果是 JSON，才用 jq 解析
STATUS=$(echo "$RAW_RES" | jq -r '.effects.status.status')

if [[ "$STATUS" == "success" ]]; then
    DIGEST=$(echo "$RAW_RES" | jq -r '.digest')
    
    # 抓取新的 Package ID
    NEW_PACKAGE_ID=$(echo "$RAW_RES" | jq -r '.objectChanges[] | select(.type == "published") | .packageId')
    
    echo -e "${GREEN}✅ 合約升級成功！${NC}"
    echo "交易 Digest    : $DIGEST"
    echo "新 Package ID  : $NEW_PACKAGE_ID"
    
    # 9. 更新 .env
    cp .env .env.bak
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/^PACKAGE_ID=.*/PACKAGE_ID=$NEW_PACKAGE_ID/" .env
    else
        sed -i "s/^PACKAGE_ID=.*/PACKAGE_ID=$NEW_PACKAGE_ID/" .env
    fi
    
    echo -e "${BLUE}已更新 .env 中的 PACKAGE_ID 為新版本。${NC}"
else
    echo -e "${RED}❌ 升級交易失敗！${NC}"
    echo "錯誤訊息："
    echo "$RAW_RES" | jq -r '.effects.status // .'
fi