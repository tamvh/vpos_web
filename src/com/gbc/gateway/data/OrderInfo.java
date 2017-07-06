/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.data;

import com.google.gson.annotations.SerializedName;

/**
 *
 * @author haint3
 */
public class OrderInfo {
    
    @SerializedName("appid")
    private String _appId;
    
    @SerializedName("appuser")
    private String _appUser;
    
    @SerializedName("apptime")
    private String _appTime;
    
    @SerializedName("amount")
    private String _amount;
    
    @SerializedName("apptransid")
    private String _appTransId;
    
    @SerializedName("embeddata")
    private String _embedData;
    
    @SerializedName("item")
    private String _item;
    
    @SerializedName("description")
    private String _description;
    
    @SerializedName("mac")
    private String _mac;

    public String getAppId() {
        return _appId;
    }

    public void setAppId(String _appId) {
        this._appId = _appId;
    }

    public String getAppUser() {
        return _appUser;
    }

    public void setAppUser(String _appUser) {
        this._appUser = _appUser;
    }

    public String getAppTime() {
        return _appTime;
    }

    public void setAppTime(String _appTime) {
        this._appTime = _appTime;
    }

    public String getAmount() {
        return _amount;
    }

    public void setAmount(String _amount) {
        this._amount = _amount;
    }

    public String getAppTransId() {
        return _appTransId;
    }

    public void setAppTransId(String _appTransId) {
        this._appTransId = _appTransId;
    }

    public String getEmbedData() {
        return _embedData;
    }

    public void setEmbedData(String _embedData) {
        this._embedData = _embedData;
    }

    public String getItem() {
        return _item;
    }

    public void setItem(String _item) {
        this._item = _item;
    }

    public String getDescription() {
        return _description;
    }

    public void setDescription(String _description) {
        this._description = _description;
    }

    public String getMac() {
        return _mac;
    }

    public void setMac(String _mac) {
        this._mac = _mac;
    }
}
