/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.zp.cashin;

import com.gbc.gateway.common.Config;
import com.gbc.gateway.common.HttpHelper;
import com.gbc.gateway.zp.ZPFormatResponse;
import com.gbc.gateway.zp.cashout.ZPGatewayDBProcessor;
import com.gbc.gateway.zp.define.ZPReturnCode;
import com.gbc.gateway.zp.define.ZPReturnMessage;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import org.apache.log4j.Logger;

/**
 *
 * @author haint3
 */
public class CashInMerchantAPI {
    protected static final Logger logger = Logger.getLogger(CashInMerchantAPI.class);
    
    private static String    _zpTransferCash        = null;
    private static String    _zpGetTransferStatus   = null;
    private static String    _zpGetStatusByMTransId = null;
    private static String    _zpGetBalance          = null;
    private static String    _zpGetUserInfo         = null;
    private static Gson      _gson = new GsonBuilder().create();
    
    public static boolean initialize() {
        String urlType = Config.getParam("zpserver", "url_type");
        String zpSection = "zpreal";
        if (urlType.compareToIgnoreCase("2") == 0) {
            zpSection = "zpsandbox";
        }

        _zpTransferCash = Config.getParam(zpSection, "transfer_cash");
        _zpGetTransferStatus = Config.getParam(zpSection, "get_transfer_status");
        _zpGetStatusByMTransId = Config.getParam(zpSection, "get_status_trans_id");
        _zpGetBalance = Config.getParam(zpSection, "get_balance");
        _zpGetUserInfo = Config.getParam(zpSection, "get_user_info");
        
        return false;
    }
    
    public String transferCash(Map<String, String> paramMap) {
        String rs = "";
        
        CompletableFuture<String> future = new CompletableFuture<>();
        
        try {
            logger.info("CashinMerchantAPI.transferCash: data = ");
            logger.info(paramMap);
            rs = HttpHelper.sendHttpPostFormData(_zpTransferCash, paramMap, 20*1000);
        } catch (IOException ex) {
            logger.error("CashInMerchantAPI.transferCash: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(ZPReturnCode.CI_SYSTEM_ERROR, ZPReturnMessage.CI_SYSTEM_ERROR);
        }
        
        future.thenAcceptAsync((postRs) -> {
            ZPCashInDBProcessor.addTransferCash(paramMap, postRs);
        });
        future.complete(rs);
        return rs;
    }
    
    
    public String getTransferStatus(Map<String, String> paramMap) {
        String rs = "";
        try {
            rs = HttpHelper.sendHttpPostFormData(_zpGetTransferStatus, paramMap, 15*1000);
        } catch (IOException ex) {
            logger.error("CashInMerchantAPI.getTransferStatus: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(0, ZPReturnMessage.SYSTEM_ERROR);
        }
            
        return rs;
    }
    
    public String getStatusByMTransId(Map<String, String> paramMap) {
        String rs = "";
        try {
            rs = HttpHelper.sendHttpPostFormData(_zpGetStatusByMTransId, paramMap, 15*1000);
        } catch (IOException ex) {
            logger.error("CashInMerchantAPI.getStatusByMTransId: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(0, ZPReturnMessage.SYSTEM_ERROR);
        }
            
        return rs;
    }
    
    public String getBalance(Map<String, String> paramMap) {
        String rs = "";
        try {
            rs = HttpHelper.sendHttpPostFormData(_zpGetBalance, paramMap, 15*1000);
        } catch (IOException ex) {
            logger.error("CashInMerchantAPI.getBalance: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(0, ZPReturnMessage.SYSTEM_ERROR);
        }
            
        return rs;
    }
    
    public String getUserInfo(Map<String, String> paramMap) {
        String rs = "";
        try {
            rs = HttpHelper.sendHttpPostFormData(_zpGetUserInfo, paramMap, 15*1000);
        } catch (IOException ex) {
            logger.error("CashInMerchantAPI.getUserInfo: ex = " + ex.getMessage(), ex);
            rs = ZPFormatResponse.format(0, ZPReturnMessage.SYSTEM_ERROR);
        }
            
        return rs;
    }
}
