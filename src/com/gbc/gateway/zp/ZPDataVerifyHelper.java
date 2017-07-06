/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.zp;

import com.gbc.gateway.common.CommonFunction;
import com.gbc.gateway.common.JsonParserUtil;
import com.gbc.gateway.data.Merchant;
import com.gbc.gateway.data.OrderInfo;
import com.gbc.gateway.hmacutil.HMACUtil;
import com.gbc.gateway.model.MerchantModel;
import com.gbc.gateway.zp.define.ZPDefineName;
import com.google.gson.JsonObject;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.apache.log4j.Logger;

/**
 *
 * @author haint3
 */
public class ZPDataVerifyHelper {
    private static ZPDataVerifyHelper _instance = null;
    private static final Lock createLock_ = new ReentrantLock();
    protected final Logger logger = Logger.getLogger(this.getClass());
    
    public static ZPDataVerifyHelper getInstance()  {
        if (_instance == null) {
            createLock_.lock();
            try {
                if (_instance == null) {
                    _instance = new ZPDataVerifyHelper();
                }
            } finally {
                createLock_.unlock();
            }
        }
        return _instance;
    }
    
    public boolean checkOrderAppTransValid(OrderInfo orderInfo) {
        if (orderInfo.getAppTransId().length() < 6) {
            return false;
        }
        
        String currentDay = CommonFunction.getCurrentDayFormat();
        if (currentDay.compareTo(orderInfo.getAppTransId().substring(0, 6)) == 0) {
            return true;
        }
        
        return false;
    }
    
    public Merchant checkCallbackValid(JsonObject jobj) {
        /*
        Merchant merchant = null;
        String dataInJson = jobj.get(ZPDefineName.DATA).getAsString();
        String macInJson = jobj.get(ZPDefineName.MAC).getAsString();
        JsonObject dataObj = JsonParserUtil.parseJsonObject(dataInJson);
        String appId = dataObj.get(ZPDefineName.APP_ID).getAsString();
        merchant = MerchantModel.getInstance().getMerchantById(appId);
        if (merchant == null) {
            return merchant;
        }
        
        String macCal = HMACUtil.HMacHexStringEncode(merchant.getHmacAlgorithm(), merchant.getKey2(), dataInJson);
        if (macCal.compareTo(macInJson) == 0) {
            return merchant;
        }
        
        return null;
        */
        
        //Not check hmac
        Merchant merchant = null;
        String dataInJson = jobj.get(ZPDefineName.DATA).getAsString();
        JsonObject dataObj = JsonParserUtil.parseJsonObject(dataInJson);
        String appId = dataObj.get(ZPDefineName.APP_ID).getAsString();
        merchant = MerchantModel.getInstance().getMerchantById(appId);
        if (merchant == null) {
            return merchant;
        }
        return merchant;
    }
}
