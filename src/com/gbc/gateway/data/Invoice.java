/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.data;

/**
 *
 * @author tamvh
 */
public class Invoice {
    private int transaction_id;
    private int app_id;
    private String app_user;
    private String app_time;
    private long amount;
    private String app_trans_id;
    private String zptransid;
    private String description;
    private String item;
    private String embed_data;
    private String mac;
    private String create_order_time;
    private String payment_time;
    private int payment_status;
        
    public int getTransaction_id() {
        return transaction_id;
    }
    public int getApp_id() {
        return app_id;
    }
    public String getApp_user() {
        return app_user;
    }
    public String getApp_time() {
        return app_time;
    }
    public long getAmount() {
        return amount;
    }
    public String getApp_trans_id() {
        return app_trans_id;
    }
    public String getZptransid() {
        return zptransid;
    }
    public String getDescription() {
        return description;
    }
    public String getItem() {
        return item;
    }
    public String getEmbed_data() {
        return embed_data;
    }
    public String getMac() {
        return mac;
    }
    public String getCreate_order_time() {
        return create_order_time;
    }
    public String getPayment_time() {
        return payment_time;
    }
    public int getPayment_status() {
        return payment_status;
    }
    
    public void setTransaction_id(int value) {
        this.transaction_id = value;
    }
    public void setApp_id(int value) {
        this.app_id = value;
    }
    public void setApp_user(String value) {
        this.app_user = value;
    }
    public void setApp_time(String value) {
        this.app_time = value;
    }
    public void setAmount(long value) {
        this.amount = value;
    }
    public void setApp_trans_id(String value) {
        this.app_trans_id = value;
    }
    public void setZptransid(String value) {
        this.zptransid = value;
    }
    public void setDescription(String value) {
        this.description = value;
    }
    public void setItem(String value) {
        this.item = value;
    }
    public void setEmbed_data(String value) {
        this.embed_data = value;
    }
    public void setMac(String value) {
        this.mac = value;
    }
    public void setCreate_order_time(String value) {
        this.create_order_time = value;
    }
    public void setPayment_time(String value) {
        this.payment_time = value;
    }
    public void setPayment_status(int value) {
        this.payment_status = value;
    }   
}
