/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.zp.cashout;

import com.gbc.gateway.common.Config;
import com.gbc.gateway.common.HttpHelper;
import com.gbc.gateway.zp.define.ZPReturnMessage;
import com.gbc.gateway.zp.define.ZPReturnCode;
import com.gbc.gateway.common.JsonParserUtil;
import com.gbc.gateway.data.Merchant;
import com.gbc.gateway.data.OrderInfo;
import com.gbc.gateway.model.MerchantModel;
import com.gbc.gateway.zp.ZPDataVerifyHelper;
import com.gbc.gateway.zp.ZPFormatResponse;
import com.gbc.gateway.zp.define.ZPDefineName;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import org.apache.log4j.Logger;

/**
 *
 * @author haint3
 */
public class ZPGatewayAPI {
    
    protected static final Logger logger = Logger.getLogger(ZPGatewayAPI.class);
    
    private static String    _zpCreateOrderUrl = null;
    private static String    _zpGetStatusUrl = null;
    private static String    _zpDoRefundUrl = null;
    private static String    _zpGRetefundStatusUrl = null;
    private static Gson      _gson = new GsonBuilder().create();
    
    public static boolean initialize() {
        String urlType = Config.getParam("zpserver", "url_type");
        String zpSection = "zpreal";
        if (urlType.compareToIgnoreCase("2") == 0) {
            zpSection = "zpsandbox";
        }

        _zpCreateOrderUrl = Config.getParam(zpSection, "create_order");
        _zpGetStatusUrl = Config.getParam(zpSection, "get_order_status");
        _zpDoRefundUrl = Config.getParam(zpSection, "refund");
        _zpDoRefundUrl = Config.getParam(zpSection, "get_refund_status");
        
        return false;
    }
    
    public String createOrder(Map<String, String> paramMap) {
        logger.info("ZPGatewayAPI.createorder param: ");
        logger.info(paramMap);
        String rs = "";
        try {
            rs = HttpHelper.sendHttpPostFormData(_zpCreateOrderUrl, paramMap, 15*1000);
        } catch (IOException ex) {
            logger.error("ZPGatewayAPI.createOrder: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(0, ZPReturnMessage.SYSTEM_ERROR);
        }
        
        logger.info("ZPGatewayAPI.createorder response: " + rs);    
        return rs;
    }
    
    public String processPaymentCallback(String data) {
        String content = "";
        
        JsonObject jobjData = JsonParserUtil.parseJsonObject(data);
        if (jobjData == null) {
            logger.error("ZPGatewayAPI.processPaymentCallback: data invalid: " + data);
            content = ZPFormatResponse.format(ZPReturnCode.PAYMENT_DATA_INVALID, ZPReturnMessage.PAYMENT_DATA_INVALID);
            return content;
        }
        
        //check data valid
        Merchant merchant = ZPDataVerifyHelper.getInstance().checkCallbackValid(jobjData);
        if (merchant == null) {
            logger.error("ZPGatewayAPI.processPaymentCallback: merchant invalid: " + data);
            content = ZPFormatResponse.format(ZPReturnCode.PAYMENT_DATA_INVALID, ZPReturnMessage.PAYMENT_DATA_INVALID);
            return content;
        }
        
        logger.info("ZPGatewayAPI.processPaymentCallback: add callback data to db");
        String dataInJson = jobjData.get(ZPDefineName.DATA).getAsString();
        JsonObject jobjDataCallBack = JsonParserUtil.parseJsonObject(dataInJson);
        
        ZPGatewayDBProcessor.addCallbackPaymentData(merchant, jobjDataCallBack);
        String transRedisKey = ZPGatewayDBProcessor.getInvoiceKey(jobjDataCallBack);
        
        try {
            logger.info("ZPGatewayAPI.processPaymentCallback: call url = " + merchant.getCallbackUrl());
            String rs = HttpHelper.sendHttpPostJson(merchant.getCallbackUrl(), data, 20*1000);
            logger.info(String.format("ZPGatewayAPI.processPaymentCallback: receive from \"%s\" response = %s",
                    merchant.getAppUser(), rs));
            ZPGatewayDBProcessor.updatePaymentStatus(transRedisKey, merchant, rs);
            content = rs;
            return content;
        } catch (IOException ex) {
            logger.error("ZPGatewayAPI.processPaymentCallback: ex = " + ex.getMessage(), ex);
            String error = ex.getMessage();
            ZPGatewayDBProcessor.updatePaymentError(transRedisKey, merchant, error);
            //push notify error
        }
        
        content = ZPFormatResponse.format(ZPReturnCode.PAYMENT_SYSTEM_ERROR, ZPReturnMessage.PAYMENT_SYSTEM_ERROR);
        return content;
    }
    
    public String processRefund(Map<String, String> paramMap) {
        String rs = "";
        CompletableFuture<String> future = new CompletableFuture<>();
        
        try {
            rs = HttpHelper.sendHttpPostFormData(_zpDoRefundUrl, paramMap, 20*1000);
        } catch (IOException ex) {
            logger.error("ZPGatewayAPI.processRefund: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(ZPReturnCode.REFUND_SYSTEM_ERROR, ZPReturnMessage.REFUND_SYSTEM_ERROR);
        }
        
        future.thenAcceptAsync((postRs) -> {
            ZPGatewayDBProcessor.addRefund(paramMap, postRs);
        });
        future.complete(rs);
            
        return rs;
    }
    
    public String processGetTransactionStatus(Map<String, String> paramMap) {
        String rs = "";
        try {
            rs = HttpHelper.sendHttpPostFormData(_zpGetStatusUrl, paramMap, 15*1000);
        } catch (IOException ex) {
            logger.error("ZPGatewayAPI.processGetTransactionStatus: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(0, ZPReturnMessage.SYSTEM_ERROR);
        }
            
        return rs;
    }
}
