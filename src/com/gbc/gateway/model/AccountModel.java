/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.model;

import com.gbc.gateway.common.AppConst;
import com.gbc.gateway.data.Account;
import com.gbc.gateway.data.Merchant;
import com.gbc.gateway.database.MySqlFactory;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.logging.Level;
import org.apache.log4j.Logger;
/**
 *
 * @author tamvh
 */
public class AccountModel {
    private static AccountModel _instance = null;
    private static final Lock createLock_ = new ReentrantLock();
    protected final Logger logger = Logger.getLogger(this.getClass());
    
    public static AccountModel getInstance() throws IOException {
        if (_instance == null) {
            createLock_.lock();
            try {
                if (_instance == null) {
                    _instance = new AccountModel();
                }
            } finally {
                createLock_.unlock();
            }
        }
        return _instance;
    }
    
    public int verifyAccount(String accountName, StringBuilder app_id) {        
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        String table_name = "account";
        int ret = -1;
        
        try {            
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            
            String queryStr;
        
            queryStr = String.format("SELECT `app_id` FROM %s  WHERE `account_name` = '%s'", table_name, accountName);
            stmt.execute(queryStr);
            rs = stmt.getResultSet();
           
            if (rs != null) {
                if (rs.next()) {
                    app_id.append(rs.getString("app_id"));
                    ret = 0;
                }
            }
            
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".getValue: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        
        return ret;
    }
    
    // for accountant page
    public int verifyLoginAccountant(String accountName) {
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        
        try {            
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            
            String queryStr;
        
            queryStr = String.format("SELECT COUNT(`account_name`) AS s1 FROM `account` WHERE `account_name` = '%1$s'",  accountName);

            stmt.execute(queryStr);
            rs = stmt.getResultSet();
           
            if (rs != null) {
                if (rs.next()) {
                    if (rs.getInt("s1") != 1) {
                        ret = 1;
                    } else {                        
                        ret = 0;
                    }
                } else {
                   ret = 2;
                }
            }            
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".verifyLoginAccountant: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        
        return ret;
    }
}
