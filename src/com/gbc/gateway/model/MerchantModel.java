/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.model;

import com.gbc.gateway.common.DBNameDefine;
import com.gbc.gateway.data.Merchant;
import com.gbc.gateway.database.MySqlFactory;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.apache.log4j.Logger;

/**
 *
 * @author haint3
 */
public class MerchantModel {
    private static MerchantModel _instance = null;
    private static final Lock createLock_ = new ReentrantLock();
    protected final Logger logger = Logger.getLogger(this.getClass());
    
    private static final Map<String, Merchant>  _merchantInfoMap = Collections.synchronizedMap(new LinkedHashMap<String, Merchant>());
    
    public static MerchantModel getInstance()  {
        if (_instance == null) {
            createLock_.lock();
            try {
                if (_instance == null) {
                    _instance = new MerchantModel();
                }
            } finally {
                createLock_.unlock();
            }
        }
        return _instance;
    }
    
    public int loadData() {
        int ret = -1;
        ret = loadDataFromMySQL();
        return ret;
    }
    
    public int loadDataFromMySQL() {
        _merchantInfoMap.clear();
        
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        
        try {            
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            String queryStr;
            
            queryStr = String.format("SELECT `app_id`, `app_user`, `key1`, `key2`, "
                    + "`description`, `active`, `callback_url`, `hmac_algorithm` FROM %s", DBNameDefine.MERCHANT_TABLE_NAME);
            stmt.execute(queryStr);
            rs = stmt.getResultSet();
            
            if (rs != null) {
                while (rs.next()) {
                    Merchant merchant = new Merchant();
                    merchant.setAppId(String.valueOf(rs.getInt("app_id")));
                    merchant.setAppUser(rs.getString("app_user"));
                    merchant.setKey1(rs.getString("key1"));
                    merchant.setKey2(rs.getString("key2"));
                    merchant.setDescription(rs.getString("description"));
                    merchant.setActive(rs.getInt("active"));
                    merchant.setCallbackUrl(rs.getString("callback_url"));
                    merchant.setHmacAlgorithm(rs.getString("hmac_algorithm"));
                    _merchantInfoMap.put(merchant.getAppId(), merchant);
                }
                
                ret = 0;
            }
            
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".loadDataFromMySQL: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        
        return ret;
    }
    
    public Merchant getMerchantById(String appId) {
        return _merchantInfoMap.get(appId);
    }
}
