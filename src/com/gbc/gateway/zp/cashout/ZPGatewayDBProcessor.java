/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.zp.cashout;

import com.gbc.gateway.zp.define.ZPRedisKeyDefine;
import com.gbc.gateway.common.CommonFunction;
import com.gbc.gateway.common.HttpHelper;
import com.gbc.gateway.common.JsonParserUtil;
import com.gbc.gateway.data.Invoice;
import com.gbc.gateway.zp.define.ZPReturnCode;
import com.gbc.gateway.data.Merchant;
import com.gbc.gateway.data.OrderInfo;
import com.gbc.gateway.redis.ZRedisClient;
import com.gbc.gateway.zp.define.ZPDefineName;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.eclipse.jetty.plus.jndi.Transaction;

/**
 *
 * @author haint3
 */
public class ZPGatewayDBProcessor {
  
    private static final Gson _gson = new GsonBuilder().create();
    
    public static String getInvoiceKey(String appId, String appTransId) {
        return ZPRedisKeyDefine.INVOICE_PREFIX_KEY_NAME + appId + ":" + appTransId;
    }
    
    public static String getInvoiceKey(JsonObject jsonObject) {
        String appId = jsonObject.get(ZPDefineName.APP_ID).getAsString();
        String appTransId = jsonObject.get(ZPDefineName.APP_TRANS_ID).getAsString();
        return getInvoiceKey(appId, appTransId);
    }
    
    
    public static String getZPTransIdKey(String appId, String zpTransId) {
        return ZPRedisKeyDefine.ZP_TRANS_PREFIX_KEY_NAME + appId + ":" + zpTransId;
    }
    
    public static String getZPTransIdKey(JsonObject jsonObject) {
        String appId = jsonObject.get(ZPDefineName.APP_ID).getAsString();
        String zpTransId = jsonObject.get(ZPDefineName.ZP_TRANS_ID).getAsString();
        return getZPTransIdKey(appId, zpTransId);
    }
    
    public static String getRefundKey(String appId, String zpTransId) {
        return ZPRedisKeyDefine.REFUND_PREFIX_KEY_NAME + appId + ":" + zpTransId;
    }
    
    public static String getRefundListKey(String day, String appId) {
        return ZPRedisKeyDefine.REFUND_LIST_PREFIX_KEY_NAME + day + "" + appId;
    }

    private static Map<String, String> convertOrderInfoToMap(OrderInfo orderInfo) {
        Map<String, String> map = new HashMap<>();
        map.put(ZPDefineName.APP_TRANS_ID, orderInfo.getAppTransId());
        map.put(ZPDefineName.APP_ID, orderInfo.getAppId());
        map.put(ZPDefineName.APP_USER, orderInfo.getAppUser());
        map.put(ZPDefineName.APP_TIME, orderInfo.getAppTime());
        map.put(ZPDefineName.AMOUNT, orderInfo.getAmount());
        map.put(ZPDefineName.PAYMENT_STATUS, Long.toString(ZPReturnCode.PAYMENT_CREATE_ORDER));
        return map;
    }

    public static CompletableFuture<Boolean> checkOrderExist(OrderInfo orderInfo) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();
        String[] keys = {getInvoiceKey(orderInfo.getAppId(), orderInfo.getAppTransId())};
        ZRedisClient.getInstance().getStringCommand().async().exists(keys)
                .thenAcceptAsync((Long exist) -> {
                    future.complete(exist >= 1);
                });
        return future;
    }

    public static CompletableFuture<Boolean> addCreateOrder(Merchant merchant, OrderInfo orderInfo) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();

        String orderKey = getInvoiceKey(orderInfo.getAppId(), orderInfo.getAppTransId());
        Map<String, String> valueField = convertOrderInfoToMap(orderInfo);
        ZRedisClient.getInstance().getStringCommand().async()
                .hmset(orderKey, valueField)
                .thenAcceptAsync((String rs) -> {
                    future.complete(rs.compareToIgnoreCase("ok") == 0);
                });
        return future;
    }

    public static CompletableFuture<Boolean> addCallbackPaymentData(Merchant merchant, JsonObject jobjCallback) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();

        String appId = jobjCallback.get(ZPDefineName.APP_ID).getAsString();
        String appUser = jobjCallback.get(ZPDefineName.APP_USER).getAsString();
        String appTime = jobjCallback.get(ZPDefineName.APP_TIME).getAsString();
        String appTransId = jobjCallback.get(ZPDefineName.APP_TRANS_ID).getAsString();
        String serverTime = jobjCallback.get(ZPDefineName.ZP_SERVER_TIME).getAsString();
        String zptransid = jobjCallback.get(ZPDefineName.ZP_TRANS_ID).getAsString();
        String channel = jobjCallback.get(ZPDefineName.CHANNEL).getAsString();
        String merchantuserid = jobjCallback.get(ZPDefineName.MERCHANT_URSER_ID).getAsString();
        String amount = jobjCallback.get(ZPDefineName.AMOUNT).getAsString();
        
        String invoiceKey = getInvoiceKey(appId, appTransId);
        String zpTransIdKey = getZPTransIdKey(appId, zptransid);

        Map<String, String> invoiceKeyField = new HashMap<>();        
        invoiceKeyField.put(ZPDefineName.PAYMENT_TIME, Long.toString(CommonFunction.getCurrentDateTimeNum()));
        invoiceKeyField.put(ZPDefineName.APP_ID, appId);
        invoiceKeyField.put(ZPDefineName.APP_USER, appUser);
        invoiceKeyField.put(ZPDefineName.APP_TIME, appTime);
        invoiceKeyField.put(ZPDefineName.APP_TRANS_ID, appTransId);
        invoiceKeyField.put(ZPDefineName.ZP_SERVER_TIME, serverTime);
        invoiceKeyField.put(ZPDefineName.ZP_TRANS_ID, zptransid);
        invoiceKeyField.put(ZPDefineName.CHANNEL, channel);
        invoiceKeyField.put(ZPDefineName.MERCHANT_URSER_ID, merchantuserid);
        invoiceKeyField.put(ZPDefineName.AMOUNT, amount);

        ZRedisClient.getInstance().getStringCommand().async()
                .hmset(invoiceKey, invoiceKeyField)
                .thenAcceptAsync((String rs) -> {
                    future.complete(rs.compareToIgnoreCase("ok") == 0);
                });
        ZRedisClient.getInstance().getStringCommand().async()
                .set(zpTransIdKey, appTransId);
        
        //push data to MySQL
        Invoice trans;
        
        return future;
    }
    
    public static CompletableFuture<Boolean> updatePaymentStatus(String transRedisKey, Merchant merchant, String paymentData) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();
        JsonObject jobj = JsonParserUtil.parseJsonObject(paymentData);
        if (jobj == null) {
            future.complete(Boolean.FALSE);
            return future;
        }
        
        int returncode = jobj.get(ZPDefineName.RETURN_CODE).getAsInt();
        String returnMessage = jobj.has(ZPDefineName.RETURN_MESSAGE) ? jobj.get(ZPDefineName.RETURN_MESSAGE).getAsString() : "";

        Map<String, String> valueField = new HashMap<>();
        valueField.put(ZPDefineName.PAYMENT_STATUS, Integer.toString(returncode));
        valueField.put(ZPDefineName.PAYMENT_MESSAGE, returnMessage);
        valueField.put(ZPDefineName.PAYMENT_TIME, Long.toString(CommonFunction.getCurrentDateTimeNum()));

        ZRedisClient.getInstance().getStringCommand().async()
                .hmset(transRedisKey, valueField)
                .thenAcceptAsync((String rs) -> {
                    future.complete(rs.compareToIgnoreCase("ok") == 0);
                });
        return future;
    }
    
    public static CompletableFuture<Boolean> updatePaymentError(String transRedisKey, Merchant merchant, String payError) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();
        
        Map<String, String> valueField = new HashMap<>();
        valueField.put(ZPDefineName.PAYMENT_ERROR, payError);

        ZRedisClient.getInstance().getStringCommand().async()
                .hmset(transRedisKey, valueField)
                .thenAcceptAsync((String rs) -> {
                    future.complete(rs.compareToIgnoreCase("ok") == 0);
                });
        return future;
    }
    
    public static CompletableFuture<Boolean> addRefund(Map<String, String> refundInfo, String refundResult) {
        CompletableFuture<Boolean> future = new CompletableFuture<>();
        
        JsonObject rsObj = JsonParserUtil.parseJsonObject(refundResult);
        
        String appId = refundInfo.get(ZPDefineName.APP_ID);
        String zpTransId = refundInfo.get(ZPDefineName.ZP_TRANS_ID);
        refundInfo.put(ZPDefineName.RETURN_CODE, rsObj.get(ZPDefineName.RETURN_CODE).getAsString());
        refundInfo.put(ZPDefineName.RETURN_MESSAGE, rsObj.get(ZPDefineName.RETURN_MESSAGE).getAsString());
        refundInfo.put(ZPDefineName.GATEWAY_TIME, String.valueOf(CommonFunction.getCurrentDateTimeNum()));
        
        String refundKey = getRefundKey(appId, zpTransId);
        String refundListKey = getRefundListKey(CommonFunction.getCurrentDayFormat(), appId);
        
        ZRedisClient.getInstance().getStringCommand().async()
                .hmset(refundKey, refundInfo)
                .thenAcceptAsync((String rs) -> {
                    boolean ok = rs.compareToIgnoreCase("ok") == 0;
                    future.complete(rs.compareToIgnoreCase("ok") == 0);
                    
                    if (ok == false) {
                        return;
                    }
                    
                    JsonObject jobj = new JsonObject();
                    jobj.addProperty(ZPDefineName.APP_ID, refundInfo.get(ZPDefineName.APP_ID));
                    jobj.addProperty(ZPDefineName.ZP_TRANS_ID, refundInfo.get(ZPDefineName.ZP_TRANS_ID));
                    String[] arr = {_gson.toJson(jobj)};
                    ZRedisClient.getInstance().getStringCommand().async()
                            .rpush(refundListKey, arr);
                    
                    String zpTransIdKey = getZPTransIdKey(appId, zpTransId);
                    ZRedisClient.getInstance().getStringCommand().async()
                            .get(zpTransIdKey)
                            .thenAcceptAsync((appTransId) -> {
                                Map<String, String> invoiceMap = new HashMap<>();
                                invoiceMap.put(ZPDefineName.REFUND_STATUS, rsObj.get(ZPDefineName.RETURN_CODE).getAsString());
                                String invoiceKey = getInvoiceKey(appId, appTransId);
                                ZRedisClient.getInstance().getStringCommand().async()
                                        .hmset(invoiceKey, invoiceMap);
                            });
                });
        
        return future;
    }
}
