/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.model;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.apache.log4j.Logger;
import com.gbc.gateway.data.Invoice;
import com.gbc.gateway.data.InvoiceSummary;
import com.gbc.gateway.database.MySqlFactory;
import com.google.gson.JsonObject;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;

/**
 *
 * @author tamvh
 */
public class InvoiceModel {
    private static InvoiceModel _instance = null;
    private static final Lock createLock_ = new ReentrantLock();
    protected final Logger logger = Logger.getLogger(this.getClass());
    
    public static InvoiceModel getInstance() throws IOException {
        if (_instance == null) {
            createLock_.lock();
            try {
                if (_instance == null) {
                    _instance = new InvoiceModel();
                }
            } finally {
                createLock_.unlock();
            }
        }
        return _instance;
    }
    
    public String getWhereClauseSearch(int app_id, int payment_status, String fromDate, String toDate) {
        StringBuilder result = new StringBuilder();
        String and = "WHERE";        
        if(fromDate != null && !fromDate.isEmpty()){
            result.append(String.format("%s (`payment_time` >= '%s')", and, fromDate));
            and = " AND ";
        }
        if(toDate != null && !toDate.isEmpty()){
            result.append(String.format("%s (`payment_time` <= '%s 23:59:59')", and, toDate));
        } 
        if(payment_status != -10) {
            and = " AND ";
            result.append(String.format("%s payment_status = %s", and, payment_status)); 
        }        
        and = " AND ";
        result.append(String.format("%s app_id = %s", and, app_id)); 
        return result.toString();
    }
    
    public int getListInvoicePerPage(
            int app_id,
            int paymentStatus, 
            String paymentDateTimeFrom, 
            String paymentDateTimeTo, 
            int fromRecord, 
            int totalTransPerPage, 
            List<Invoice> listInvoice) {
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        String tableNameTrans = "transactions";  
        String queryStr;
        Invoice invoice;
        try {            
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            queryStr = String.format("SELECT `transaction_id`, `app_id`, `app_user`, DATE_FORMAT(`app_time`, '%%Y-%%m-%%d %%H:%%i:%%s') AS `app_time`, `amount`, `app_trans_id`, `zptransid`, `description`, `item`, `embed_data`, `mac`, DATE_FORMAT(`create_order_time`, '%%Y-%%m-%%d %%H:%%i:%%s') AS `create_order_time`, `payment_time`, `payment_status` FROM %s %s ORDER BY `transaction_id` DESC LIMIT %s,%s", 
                                      tableNameTrans, getWhereClauseSearch(app_id, paymentStatus, paymentDateTimeFrom, paymentDateTimeTo), fromRecord, totalTransPerPage);                      
            
            stmt.execute(queryStr);            
            rs = stmt.getResultSet();
            if (rs != null) {
                while (rs.next()) {                   
                    invoice = new Invoice();                                        
                    invoice.setTransaction_id(rs.getInt("transaction_id"));
                    invoice.setApp_id(rs.getInt("app_id"));
                    invoice.setApp_user(rs.getString("app_user"));
                    invoice.setApp_time(rs.getString("app_time"));
                    invoice.setAmount(rs.getLong("amount"));
                    invoice.setApp_trans_id(rs.getString("app_trans_id"));
                    invoice.setZptransid(rs.getString("zptransid"));
                    invoice.setDescription(rs.getString("description"));
                    invoice.setItem(rs.getString("item"));
                    invoice.setEmbed_data(rs.getString("embed_data"));
                    invoice.setMac(rs.getString("mac"));
                    invoice.setCreate_order_time(rs.getString("create_order_time"));
                    invoice.setPayment_time(rs.getString("payment_time"));
                    invoice.setPayment_status(rs.getInt("payment_status"));                    
                    listInvoice.add(invoice);
                }
                ret = 0;
            }
        } catch (SQLException ex) {
            logger.error(getClass().getSimpleName() + ".getListInvoicePerPage: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        return ret;
    }
    
    public int getSummaryInvoice(int app_id, int payment_status, String fromDay, String toDay, InvoiceSummary summary) {
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        String tableNameTrans = "transactions";        
        String queryStr;
        try {            

            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            
            // Get summary success
            queryStr = String.format("SELECT SUM(amount) as amount FROM %s %s ", 
                                      tableNameTrans, getWhereClauseSearch(app_id, payment_status, fromDay, toDay));                      
            stmt.execute(queryStr);            
            rs = stmt.getResultSet();                        
            if (rs != null) {
                while (rs.next()) {
                    summary.setTotal_amount_zalopay_success(rs.getLong("amount")); 
                }
                ret = 0;
            }
            
            
            // Get trans success
            queryStr = String.format("SELECT COUNT(app_trans_id) AS total_invoice FROM %s %s", 
                                      tableNameTrans, getWhereClauseSearch(app_id, payment_status, fromDay, toDay));          
            stmt.execute(queryStr);            
            rs = stmt.getResultSet();
            
            if (rs != null) {
                while (rs.next()) {
                    summary.setTotal_invoice_zalopay_success(rs.getLong("total_invoice"));
                }
                ret = 0;
            }              
            
            // Get User success
            queryStr = String.format("SELECT COUNT(distinct app_id) AS total_user_by_zalopay FROM %s %s", 
                                      tableNameTrans, getWhereClauseSearch(app_id, payment_status, fromDay, toDay));          
            stmt.execute(queryStr);            
            rs = stmt.getResultSet();
            
            if (rs != null) {
                while (rs.next()) {
                    summary.setTotal_user_zalopay_success(rs.getLong("total_user_by_zalopay"));
                }
                ret = 0;
            }              
            
        } catch (SQLException ex) {
            logger.error(getClass().getSimpleName() + ".getSummaryInvoice: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        return ret;
    }
    public int getSummaryInvoice(int app_id, int payment_status, String fromDay, String toDay, JsonObject summary) {
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        int payment_status_success = 1;
        int payment_status_fail = 0;
        int payment_status_all = -10;
        String tableNameTrans = "transactions";        
        String queryStr;
        try {            

            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            
            // count trans success
            queryStr = String.format("SELECT COUNT(app_trans_id) as total_invoice_success FROM %s %s ", 
                                      tableNameTrans, getWhereClauseSearch(app_id, payment_status_success, fromDay, toDay));                      
            stmt.execute(queryStr);            
            rs = stmt.getResultSet();                        
            if (rs != null) {
                while (rs.next()) {
                    summary.addProperty("total_invoice_success", rs.getLong("total_invoice_success")); 
                }
                ret = 0;
            }
            
            // count trans fail
            queryStr = String.format("SELECT COUNT(app_trans_id) as total_invoice_fail FROM %s %s ", 
                                      tableNameTrans, getWhereClauseSearch(app_id, payment_status_fail, fromDay, toDay));                      
            stmt.execute(queryStr);            
            rs = stmt.getResultSet();                        
            if (rs != null) {
                while (rs.next()) {
                    summary.addProperty("total_invoice_fail", rs.getLong("total_invoice_fail")); 
                }
                ret = 0;
            }
            
            // amount money success
            queryStr = String.format("SELECT SUM(amount) as total_amount_success FROM %s %s ", 
                                      tableNameTrans, getWhereClauseSearch(app_id, payment_status_success, fromDay, toDay));                      
            stmt.execute(queryStr);            
            rs = stmt.getResultSet();                        
            if (rs != null) {
                while (rs.next()) {
                    summary.addProperty("total_amount_success", rs.getLong("total_amount_success")); 
                }
                ret = 0;
            }
            
            // amount money refund
            summary.addProperty("total_amount_refund", 0); 
            
        } catch (SQLException ex) {
            logger.error(getClass().getSimpleName() + ".getSummaryInvoice: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        return ret;
    }
    
    public int addPaymentData(
            int app_id,
            String app_user,
            String app_time,
            long amount,
            String app_trans_id,
            String zptransid, 
            String description, 
            String item, 
            String embed_data,
            String mac,
            String create_order_time,
            String payment_time,
            int payment_status) {
        
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        String queryStr;
        try {            
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            queryStr = String.format("INSERT INTO `transactions`("
                    + "`app_id`, "
                    + "`app_user`, "
                    + "`app_time`, "
                    + "`amount`, "
                    + "`app_trans_id`, "
                    + "`zptransid`, "
                    + "`description`, "
                    + "`item`, "
                    + "`embed_data`, "
                    + "`mac`, "
                    + "`create_order_time`, "
                    + "`payment_time`, "
                    + "`payment_status`) VALUES (%s, '%s', FROM_UNIXTIME(0.001 * %s), %s, '%s', %s, '%s', '%s', '%s', '%s', FROM_UNIXTIME(0.001 * %s), FROM_UNIXTIME(0.001 * %s), %s)",
                    app_id,
                    app_user,
                    app_time,
                    amount,
                    app_trans_id,
                    zptransid,
                    description,
                    item,
                    embed_data,
                    mac,
                    create_order_time,
                    payment_time,
                    payment_status);                      
            
            stmt.execute(queryStr);            
            
        } catch (SQLException ex) {
            logger.error(getClass().getSimpleName() + ".addPaymentData: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        return ret;
    }
    
    public int updatePaymentData(
            String app_trans_id,
            int payment_stt,
            String payment_time) {
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        String queryStr;

        try {
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();
            queryStr = String.format("UPDATE `transactions` SET "
                    + "`payment_time` = FROM_UNIXTIME(0.001 * %s), "
                    + "`payment_status` = %s "
                    + "WHERE `app_trans_id` = '%s'",
                    payment_time, payment_stt, app_trans_id);

            stmt.execute(queryStr);
            ret = 1;
        } catch (SQLException ex) {
            logger.error(getClass().getSimpleName() + ".updatePaymentData: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        return ret;
    }
}
