/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.data;

import java.util.List;

/**
 *
 * @author haint3
 */
public class CashInMerchant {
    private String          _mid;
    private String          _name;
    private String          _hashKey;
    private List<String>    _zalopayIdList;

    public String getMid() {
        return _mid;
    }

    public void setMid(String _mid) {
        this._mid = _mid;
    }

    public String getName() {
        return _name;
    }

    public void setName(String _name) {
        this._name = _name;
    }

    public String getHashKey() {
        return _hashKey;
    }

    public void setHashKey(String _hashKey) {
        this._hashKey = _hashKey;
    }

    public List<String> getZalopayIdList() {
        return _zalopayIdList;
    }

    public void setZalopayIdList(List<String> _zalopayIdList) {
        this._zalopayIdList = _zalopayIdList;
    }
}
