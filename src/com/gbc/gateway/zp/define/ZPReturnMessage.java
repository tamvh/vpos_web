/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.zp.define;

/**
 *
 * @author haint3
 */
public class ZPReturnMessage {
    
    //Create order
    public static final String CREATE_ORDER_SUCCESS             = "success";
    public static final String CREATE_ORDER_APPID_INVALID       = "appid invalid";
    public static final String CREATE_ORDER_APPTRANSID_INVALID  = "apptransid invalid";
    public static final String CREATE_ORDER_DATA_INVALID        = "data invalid";
    public static final String CREATE_ORDER_SYSTEM_ERROR        = "system error";
    
    //Payment
    public static final String PAYMENT_SUCCESS                  = "success";
    public static final String PAYMENT_COINCIDENCE_TRANS_ID     = "zptransid or apptransid is coincidence";
    public static final String PAYMENT_RECALLBACK               = "recallback";
    public static final String PAYMENT_REFUND_FOR_USER          = "refund";
    public static final String PAYMENT_DATA_INVALID             = "data invalid";
    public static final String PAYMENT_SYSTEM_ERROR             = "system error";
    public static final String PAYMENT_CANCEL                   = "transaction cancel";
    
    //Refund
    public static final String REFUND_SYSTEM_ERROR              = "system error";
    
    //Normal
    public static final String SYSTEM_ERROR                     = "Hệ thống đang có lỗi, vui lòng quay lại sau";
    
    
    
    /*
    *   Cash in merchant ****************************************
    */
    public static final String CI_SYSTEM_ERROR                  = "Hệ thống đang có lỗi, vui lòng thử lại sau!";
    /*
    *************************************************************
    */
}
