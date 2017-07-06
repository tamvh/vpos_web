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
public class Merchant {
    
    @SerializedName("appuser")
    private String _appUser;
    
    @SerializedName("appid")
    private String _appId;
    
    @SerializedName("key1")
    private String _key1;
    
    @SerializedName("key2")
    private String _key2;
    
    @SerializedName("description")
    private String _description;
    
    @SerializedName("active")
    private int _active;
    
    @SerializedName("callbackurl")
    private String _callbackUrl;
    
    @SerializedName("hmac_algorithm")
    private String _hmacAlgorithm;

    public String getAppUser() {
        return _appUser;
    }

    public void setAppUser(String _appUser) {
        this._appUser = _appUser;
    }

    public String getAppId() {
        return _appId;
    }

    public void setAppId(String _appId) {
        this._appId = _appId;
    }

    public String getKey1() {
        return _key1;
    }

    public void setKey1(String _key1) {
        this._key1 = _key1;
    }

    public String getKey2() {
        return _key2;
    }

    public void setKey2(String _key2) {
        this._key2 = _key2;
    }

    public String getDescription() {
        return _description;
    }

    public void setDescription(String _description) {
        this._description = _description;
    }

    public int getActive() {
        return _active;
    }

    public void setActive(int _active) {
        this._active = _active;
    }

    public String getCallbackUrl() {
        return _callbackUrl;
    }

    public void setCallbackUrl(String _callbackUrl) {
        this._callbackUrl = _callbackUrl;
    }

    public String getHmacAlgorithm() {
        return _hmacAlgorithm;
    }

    public void setHmacAlgorithm(String _hmacAlgorithm) {
        this._hmacAlgorithm = _hmacAlgorithm;
    }
}
