#!/bin/bash

# 設定顏色
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ==========================================
# 1. 自動定位並切換到專案根目錄
# ==========================================
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."
cd "$PROJECT_ROOT" || exit

# 2. 讀取 .env
if [ -f .env ]; then
    export $(cat .env | xargs)
else
    echo -e "${RED}❌ 找不到 .env 檔案，請先執行 deploy_testnet.sh${NC}"
    exit 1
fi

echo -e "${BLUE}=== Nereus Market 互動介面 ===${NC}"
echo "Package: $PACKAGE_ID"
echo "Market:  $MARKET_ID"

# ==========================================
# 選單
# ==========================================
echo "-------------------------------------"
echo "請選擇操作:"
echo "1. 查詢 USDC 餘額 (Balance)"
echo "2. 存入 USDC 到 Market (Deposit)"
echo "3. 掛買單 (Place Order - Buy YES)"
echo "4. 查看 Market 狀態"
echo "5. 查詢買賣單 (Bids YES / Asks NO)"
echo "-------------------------------------"
read -p "輸入選項 (1-5): " OPTION     

case $OPTION in
    1)
        echo -e "${GREEN}查詢 USDC Coin...${NC}"
        
        # 執行指令並清洗警告訊息
        BALANCE_RES=$(sui client balance --coin-type ${PACKAGE_ID}::usdc::USDC --json 2>&1 | grep -v "^\[warning\]")
        
        # 解析並顯示
        PARSED_COINS=$(echo "$BALANCE_RES" | jq -r '.. | objects? | select(has("coinObjectId")) | "Object ID: \(.coinObjectId) | Balance: \(.balance)"')

        if [ -z "$PARSED_COINS" ]; then
            echo -e "${RED}❌ 找不到 USDC 物件。${NC}"
        else
            echo "$PARSED_COINS"
        fi
        ;;

    2)
        read -p "請輸入來源 USDC Coin Object ID: " COIN_ID
        read -p "請輸入金額 (USDC, 留空或 0 則開啟選單): " INPUT_AMT

        # === 邏輯判斷：如果為空或為 0 ===
        if [ -z "$INPUT_AMT" ] || [ "$INPUT_AMT" == "0" ]; then
            echo "⚠️  未輸入金額，請選擇預設值："
            echo "1) 1 USDC"
            echo "2) 10 USDC"
            echo "3) 100 USDC"
            read -p "請選擇 (1-3): " AMT_CHOICE

            case $AMT_CHOICE in
                1) INPUT_AMT=1 ;;
                2) INPUT_AMT=10 ;;
                3) INPUT_AMT=100 ;;
                *) INPUT_AMT=1 ;;
            esac
        fi

        # === 轉換為 MIST (USDC 9 位小數) ===
        AMOUNT_MIST="${INPUT_AMT}000000000"
        echo -e "${GREEN}準備存入金額: ${INPUT_AMT} USDC ($AMOUNT_MIST MIST)...${NC}"

        # === 步驟 A: 切分 Coin (Split Coin) ===
        echo "正在切分 Coin..."
        
        SPLIT_RES=$(sui client split-coin \
            --coin-id $COIN_ID \
            --amounts $AMOUNT_MIST \
            --gas-budget 100000000 \
            --json 2>&1 | grep -v "^\[warning\]")

        # 檢查切分是否成功
        if [[ $(echo "$SPLIT_RES" | jq -r '.effects.status.status') != "success" ]]; then
            echo -e "${RED}❌ 切分失敗！請確認餘額是否足夠。${NC}"
            echo "$SPLIT_RES" | jq .effects.status
            exit 1
        fi

        # 抓取新產生的 Coin ID
        NEW_COIN_ID=$(echo "$SPLIT_RES" | jq -r '.objectChanges[] | select(.type == "created" and (.objectType | contains("::usdc::USDC"))) | .objectId' | head -n 1)

        if [ -z "$NEW_COIN_ID" ]; then
            echo -e "${RED}❌ 無法取得新 Coin ID${NC}"
            exit 1
        fi
        
        echo "✅ 切分成功，新 Coin ID: $NEW_COIN_ID"

        # === 步驟 B: 存入 Market (Deposit) ===
        echo -e "${GREEN}正在存入 Market...${NC}"
        
        DEPOSIT_RES=$(sui client call \
            --package $PACKAGE_ID \
            --module market \
            --function deposit_usdc \
            --args $MARKET_ID $NEW_COIN_ID \
            --gas-budget 100000000 \
            --json 2>&1 | grep -v "^\[warning\]")
        
        if [[ $(echo "$DEPOSIT_RES" | jq -r '.effects.status.status') == "success" ]]; then
            echo -e "${GREEN}✅ 存款成功！${NC}"
        else
            echo -e "${RED}❌ 存款失敗！${NC}"
            echo "$DEPOSIT_RES" | jq .effects.status
        fi
        ;;

    3)
        echo -e "${YELLOW}=== 掛單 (Buy YES) - PTB Mode ===${NC}"
        echo "使用 PTB 在單筆交易中執行: create_order -> post_order"
        
        # 1. 獲取當前使用者地址 (create_order 需要傳入 maker 地址)
        SENDER=$(sui client active-address)
        echo "Maker Address: $SENDER"

        read -p "您願意付出多少 USDC? (Maker Amount): " M_Input
        read -p "您想要獲得多少 YES? (Taker Amount): " T_Input
        
        # 轉換單位 (x 10^9)
        M_AMT="${M_Input}000000000"
        T_AMT="${T_Input}000000000"
        
        # 生成隨機 Salt
        SALT=$RANDOM
        
        echo "--------------------------------"
        echo "Maker (付出): $M_Input USDC"
        echo "Taker (獲得): $T_Input YES"
        echo "Salt: $SALT"
        echo "--------------------------------"
        
        echo -e "${YELLOW}正在發送 PTB 交易...${NC}"

        # ==================================================================
        # PTB 指令解釋：
        # 1. --move-call ...create_order : 執行創建訂單函數
        #    參數: @Maker @M_Amt @T_Amt Role(0=Buy) Token(1=YES) Exp(0) Salt
        # 2. --assign order_obj : 將上一步的結果(Order Struct)存入變數 order_obj
        # 3. --move-call ...post_order : 將訂單提交到市場
        #    參數: @MarketID order_obj
        # ==================================================================
        
        RAW_RES=$(sui client ptb \
            --move-call $PACKAGE_ID::market::create_order \
                @$SENDER \
                $M_AMT \
                $T_AMT \
                0u8 \
                1u8 \
                0u64 \
                ${SALT}u64 \
            --assign order_obj \
            --move-call $PACKAGE_ID::market::post_order \
                @$MARKET_ID \
                order_obj \
            --gas-budget 100000000 \
            --json 2>&1)

        # 清洗輸出
        CLEAN_RES=$(echo "$RAW_RES" | grep -v "^\[warning\]")
        STATUS=$(echo "$CLEAN_RES" | jq -r '.effects.status.status' 2>/dev/null)

        if [[ "$STATUS" == "success" ]]; then
            DIGEST=$(echo "$CLEAN_RES" | jq -r '.digest')
            echo -e "${GREEN}✅ PTB 掛單成功！${NC}"
            echo "交易 ID: $DIGEST"
        else
            echo -e "${RED}❌ PTB 掛單失敗！${NC}"
            echo "--------------------------------"
            echo "錯誤詳情:"
            # 嘗試解析錯誤，若失敗則印出全文
            PARSED_ERROR=$(echo "$CLEAN_RES" | jq -r '.effects.status // empty' 2>/dev/null)
            if [ -n "$PARSED_ERROR" ]; then
                echo "$PARSED_ERROR"
            else
                echo "$CLEAN_RES"
            fi
        fi
        ;;
    4)
        echo -e "${GREEN}查詢 Order Book (Direct Scan Mode)...${NC}"
        echo -e "${YELLOW}正在直接讀取鏈上訂單物件 (無需 BCS 解碼)...${NC}"
        
        # 定義清洗函數 (移除顏色代碼和警告)
        clean_output() {
            sed 's/\x1b\[[0-9;]*m//g' | grep -v "warning" | grep -v "Client/Server"
        }

        # 1. 獲取 Market 的 active_orders Table ID
        # ---------------------------------------------------
        RAW_MARKET=$(sui client object $MARKET_ID --json 2>&1 | clean_output)
        
        # 使用遞迴搜尋確保能抓到 active_orders
        ACTIVE_ORDERS_DATA=$(echo "$RAW_MARKET" | jq -r '.. | .active_orders? | select(. != null)')
        TABLE_ID=$(echo "$ACTIVE_ORDERS_DATA" | jq -r '.fields.id.id // empty')
        
        if [ -z "$TABLE_ID" ]; then
            echo -e "${RED}❌ 無法讀取 active_orders Table ID。${NC}"
        else
            echo "Table ID: $TABLE_ID"
            
            # 2. 抓取 Table 中所有 Dynamic Field 的 ID
            # ---------------------------------------------------
            DF_RES=$(sui client dynamic-field $TABLE_ID --json 2>&1 | clean_output)
            
            # 檢查是否有資料
            DF_COUNT=$(echo "$DF_RES" | jq -r '.data | length' 2>/dev/null)
            
            if [ -z "$DF_COUNT" ] || [ "$DF_COUNT" == "0" ]; then
                echo -e "${YELLOW}目前市場上沒有掛單。${NC}"
            else
                echo -e "${YELLOW}找到 $DF_COUNT 筆訂單，正在解析內容...${NC}"
                
                FIELD_IDS=$(echo "$DF_RES" | jq -r '.data[].objectId')
                
                # 初始化分類字串
                STR_BIDS_YES=""
                STR_ASKS_NO=""
                COUNT_BIDS=0
                COUNT_ASKS=0

                # 3. 迴圈讀取每個訂單內容並分類
                # ---------------------------------------------------
                for fid in $FIELD_IDS; do
                    # 讀取 Field Object
                    OBJ_DATA=$(sui client object $fid --json 2>&1 | clean_output)
                    
                    # 抓取深層的 Order 結構
                    # 路徑: DynamicField -> Node -> Value(Order) -> Fields
                    ORDER_VAL=$(echo "$OBJ_DATA" | jq -r '.. | .value? | .fields? | .value? | .fields? | select(.maker != null)')
                    
                    if [ -z "$ORDER_VAL" ]; then continue; fi
                    
                    # 提取欄位
                    MAKER=$(echo "$ORDER_VAL" | jq -r '.maker')
                    SIDE=$(echo "$ORDER_VAL" | jq -r '.maker_role')   # 0=Buy, 1=Sell
                    TOKEN=$(echo "$ORDER_VAL" | jq -r '.token_id')    # 1=YES, 0=NO
                    M_AMT=$(echo "$ORDER_VAL" | jq -r '.maker_amount')
                    T_AMT=$(echo "$ORDER_VAL" | jq -r '.taker_amount')
                    
                    # === 數值顯示處理 (macOS Bash 相容寫法) ===
                    # Maker Amount (USDC) -> 轉為整數顯示 (除以 10^9)
                    M_Len=${#M_AMT}
                    if [[ $M_Len -gt 9 ]]; then
                        M_Show="${M_AMT:0:$((M_Len-9))}"
                    else
                        M_Show="0.${M_AMT}"
                    fi

                    # Taker Amount (YES/NO) -> 轉為整數顯示
                    T_Len=${#T_AMT}
                    if [[ $T_Len -gt 9 ]]; then
                        T_Show="${T_AMT:0:$((T_Len-9))}"
                    else
                        T_Show="0.${T_AMT}"
                    fi

                    # 格式化單行輸出
                    LINE="Maker: ${MAKER:0:6}... | Pay: ${M_Show} USDC -> Get: ${T_Show}"

                    # === 分類邏輯 ===
                    # 1. Bids YES (買 YES): Side=0 (Buy) AND Token=1 (YES)
                    if [[ "$SIDE" == "0" && "$TOKEN" == "1" ]]; then
                        STR_BIDS_YES="${STR_BIDS_YES}${LINE} YES\n"
                        COUNT_BIDS=$((COUNT_BIDS+1))
                    
                    # 2. Asks NO (賣 NO): Side=1 (Sell) AND Token=0 (NO)
                    elif [[ "$SIDE" == "1" && "$TOKEN" == "0" ]]; then
                        STR_ASKS_NO="${STR_ASKS_NO}${LINE} USDC (Sell NO)\n"
                        COUNT_ASKS=$((COUNT_ASKS+1))
                    fi
                done
                
                # 4. 顯示最終結果
                # ---------------------------------------------------
                echo "========================================"
                echo -e "${GREEN}Bids for YES (買入 YES)${NC}"
                echo "----------------------------------------"
                if [ "$COUNT_BIDS" -eq 0 ]; then
                    echo "無"
                else
                    echo -e "$STR_BIDS_YES"
                fi
                
                echo "========================================"
                echo -e "${RED}Asks for NO (賣出 NO)${NC}"
                echo "----------------------------------------"
                if [ "$COUNT_ASKS" -eq 0 ]; then
                    echo "無"
                else
                    echo -e "$STR_ASKS_NO"
                fi
                echo "========================================"
            fi
        fi
        ;;


    5)
        echo -e "${GREEN}查詢 Order Book (Pure PTB - New BCS)...${NC}"
        
        # 確保使用最新版 BCS
        # npm install @mysten/bcs@latest

        # 定義清洗函數
        clean_output() {
            sed 's/\x1b\[[0-9;]*m//g' | grep -v "warning" | grep -v "Client/Server"
        }

        # 定義查詢函數
        query_ptb_stdlib() {
            local FUNC=$1
            local TOKEN=$2
            local LABEL=$3
            
            echo "--------------------------------------------------"
            echo -e "正在查詢: $LABEL"
            
            RAW_OUT=$(sui client ptb \
                --move-call "0x1::option::some<u8>" ${TOKEN}u8 \
                --assign token_opt \
                --move-call "0x1::option::none<vector<u8>>" \
                --assign cursor_opt \
                --move-call "$PACKAGE_ID::market::$FUNC" @$MARKET_ID token_opt cursor_opt 100u64 \
                --dev-inspect \
                2>&1 | clean_output)

            if echo "$RAW_OUT" | grep -q "Status: Success"; then
                # 1. 抓取所有 Bytes 行
                BYTES_LINES=$(echo "$RAW_OUT" | grep "Bytes:")
                
                # 2. 找出最長的那一行 (真實數據)
                DATA_LINE=$(echo "$BYTES_LINES" | awk 'length($0) > 50')
                
                if [ -n "$DATA_LINE" ]; then
                    echo -e "${GREEN}結果: 有訂單！正在解碼...${NC}"
                    
                    # 3. 關鍵修正：提取純 JSON 陣列 string
                    # 使用 sed 將 "    Bytes: " 替換為空字串
                    CLEAN_BYTES=$(echo "$DATA_LINE" | sed 's/.*Bytes: //')
                    
                    # 4. 呼叫 Node.js 進行解碼
                    # 確保路徑正確指向 script/decode_order.js
                    node script/decode_order.js "$CLEAN_BYTES"
                else
                    echo -e "${YELLOW}結果: 無訂單 (Empty)${NC}"
                fi
            else
                echo -e "${RED}❌ PTB 執行失敗${NC}"
                echo "$RAW_OUT" | head -n 20
            fi
        }

        # 1. Bids YES (買 YES)
        query_ptb_stdlib "get_bids" "1" "Bids for YES (買入 YES)"

        # 2. Asks NO (賣 NO)
        query_ptb_stdlib "get_asks" "0" "Asks for NO  (賣出 NO )"
        
        echo "--------------------------------------------------"
        ;;

    *)
        echo "無效選項"
        ;;
esac