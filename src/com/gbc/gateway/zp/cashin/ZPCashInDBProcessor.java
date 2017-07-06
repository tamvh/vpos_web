/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.zp.cashin;

import com.gbc.gateway.common.HttpHelper;
import com.gbc.gateway.common.JsonParserUtil;
import com.gbc.gateway.data.OrderInfo;
import com.gbc.gateway.redis.ZRedisClient;
import static com.gbc.gateway.zp.cashout.ZPGatewayDBProcessor.getInvoiceKey;
import com.gbc.gateway.zp.define.ZPDefineName;
import com.gbc.gateway.zp.define.ZPRedisKeyDefine;
import com.google.gson.JsonObject;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 *
 * @author haint3
 */
public class ZPCashInDBProcessor {
    
    public static String getTransferCashKey(String mid, String mTransId) {
        return ZPRedisKeyDefine.TRANSFER_CASH_PREFIX_KEY_NAME + mid + ":" + mTransId;
    }
    
    public static CompletableFuture<Boolean> checkCashTransIdExist(String mid, String mTransId) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();
        String key = getTransferCashKey(mid, mTransId);
        String[] keys = {key};
        ZRedisClient.getInstance().getStringCommand().async()
                .exists(keys)
                .thenAcceptAsync((Long exist) -> {
                    future.complete(exist >= 1);
                });
        return future;
    }
    
    public static CompletableFuture<Boolean> addTransferCash(Map<String, String> cashInfoMap, String response) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();
        
        String mid = cashInfoMap.get(ZPDefineName.CI_MID);
        String mTransId = cashInfoMap.get(ZPDefineName.CI_MTRANS_ID);
        
        checkCashTransIdExist(mid, mTransId)
                .thenAcceptAsync( (exist) -> {
                    JsonObject resJobj = JsonParserUtil.parseJsonObject(response);
                    int returncode = resJobj.get(ZPDefineName.RETURN_CODE).getAsInt();
                    if (returncode < 0 && exist) {
                        future.complete(Boolean.FALSE);
                    } else {
                       cashInfoMap.put(ZPDefineName.CI_RETURN_CODE, resJobj.get(ZPDefineName.CI_RETURN_CODE).getAsString());
                       cashInfoMap.put(ZPDefineName.CI_RETURN_MESSAGE, resJobj.get(ZPDefineName.CI_RETURN_MESSAGE).getAsString());
                       cashInfoMap.put(ZPDefineName.CI_IS_PROCESSING, resJobj.get(ZPDefineName.CI_IS_PROCESSING).getAsString());
                       cashInfoMap.put(ZPDefineName.CI_RESPONSE_AMOUNT, resJobj.get(ZPDefineName.CI_AMOUNT).getAsString());
                       cashInfoMap.put(ZPDefineName.CI_ZP_TRANS_ID, resJobj.get(ZPDefineName.CI_ZP_TRANS_ID).getAsString());
                       
                       String key = getTransferCashKey(mid, mTransId);
                       ZRedisClient.getInstance().getStringCommand().async()
                               .hmset(key, cashInfoMap)
                               .thenAcceptAsync((String rs) -> {
                                    future.complete(rs.compareToIgnoreCase("ok") == 0);
                                });
                    }
                });
        
        
        
        return future;
    }
}
