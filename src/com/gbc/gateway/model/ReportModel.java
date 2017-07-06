/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.model;

import com.gbc.gateway.data.InvoiceSummary;
import com.gbc.gateway.database.MySqlFactory;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.apache.log4j.Logger;

/**
 *
 * @author tamvh
 */
public class ReportModel {
    private static ReportModel _instance = null;
    private static final Lock createLock_ = new ReentrantLock();
    protected final Logger logger = Logger.getLogger(this.getClass());

    public static ReportModel getInstance() throws IOException {
        if (_instance == null) {
            createLock_.lock();
            try {
                if (_instance == null) {
                    _instance = new ReportModel();
                }
            } finally {
                createLock_.unlock();
            }
        }
        return _instance;
    }
    
    public String getWhereClauseSearch(int app_id, String paymentDateTimeFrom, String paymentDateTimeTo) {
        StringBuilder result = new StringBuilder();
        String and = "WHERE (`payment_status` = 1) AND ";
        
        if (paymentDateTimeFrom != null && !paymentDateTimeFrom.isEmpty()) {
            result.append(String.format("%s (`payment_time` >= '%s')", and, paymentDateTimeFrom));
            and = " AND ";
        }
        if (paymentDateTimeTo != null && !paymentDateTimeTo.isEmpty()) {
            result.append(String.format("%s (`payment_time` <= '%s 23:59:59')", and, paymentDateTimeTo));     
            and = " AND ";
        }
        result.append(String.format("%s (`app_id` = %s)", and, app_id));
        
        return result.toString();
    }
    
    public int getReportByDatePerPage(int app_id, String fromDate, String toDate , int fromRecord, int totalRecordPerPage, List<InvoiceSummary> listSummary, JsonObject obj) {        
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;        
        int totalRecord = 0;
        long totalRevenue = 0;
        long totalInvoice = 0;
        try {            
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();            
            String tableName = "transactions";
            String queryStr;
            queryStr = String.format("SELECT SUM(`amount`) AS `amount`, COUNT(`app_trans_id`) AS `total_invoice`, DATE(`payment_time`) AS `date` "
                                   + "FROM %s "
                                   + "%s "
                                   + "GROUP BY `date` ", tableName,  getWhereClauseSearch(app_id, fromDate, toDate));
            System.out.println("Query by date: " + queryStr);
            stmt.execute(queryStr);
            rs = stmt.getResultSet();             
            if (rs != null)
            {                
                while (rs.next()) {                    
                    totalRecord += 1;
                    totalRevenue += rs.getLong("amount");
                }                
                obj.addProperty("totalRecord", totalRecord);
                obj.addProperty("totalRevenue", totalRevenue);

            }
            queryStr = String.format("SELECT SUM(`amount`) AS `amount`, COUNT(`app_trans_id`) AS `total_invoice`, DATE(`payment_time`) AS `date` "
                                   + "FROM %s "
                                   + "%s "
                                   + "GROUP BY `date` DESC "
                                   + "LIMIT %s,%s", tableName, getWhereClauseSearch(app_id, fromDate, toDate), fromRecord, totalRecordPerPage);
                                   
            
            stmt.execute(queryStr);
            rs = stmt.getResultSet();             
            if (rs != null)
            {                
                while (rs.next()) {                    
                    InvoiceSummary summary = new InvoiceSummary();
                    summary.setTotal_amount_zalopay_success(rs.getLong("amount"));
                    summary.setTotal_invoice_zalopay_success(rs.getLong("total_invoice"));
                    totalInvoice += summary.getTotal_invoice_zalopay_success();
                    summary.setDate(rs.getString("date"));                    
                    listSummary.add(summary);
                }                
                ret = 0;
                obj.addProperty("totalInvoice", totalInvoice);
            }
            
        } catch (Exception ex) {
            ret = -1;
            logger.error(getClass().getSimpleName() + ".getSummaryInvoiceByDate: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        
        return ret;
    }

    public int getReportByMonthPerPage(int app_id, String fromDate, String toDate, int fromRecord, int totalRecordPerPage, List<InvoiceSummary> listSummary, JsonObject obj) {
        Connection connection = null;
        Statement stmt = null;
        ResultSet rs = null;
        int ret = -1;
        String tableName = "transactions";
        String queryStr;
        
        long totalRecord = 0;
        long totalRevenue = 0;
        long totalInvoice = 0;
        
        try {            
            connection = MySqlFactory.getConnection();
            stmt = connection.createStatement();                        
    
            queryStr = String.format("SELECT SUM(`amount`) AS `revenue`, COUNT(`app_trans_id`) AS `total_invoice`, MONTH(`payment_time`) AS `month`, YEAR(`payment_time`) AS `year` \n" +
                         "FROM %s \n" +
                         "%s \n"+
                         "GROUP BY `month`, `year` ", tableName, getWhereClauseSearch(app_id, fromDate, toDate));

            stmt.execute(queryStr);
            rs = stmt.getResultSet();             
            if (rs != null)
            {
                while (rs.next()) {
                  totalRecord += 1;
                  totalRevenue += rs.getLong("revenue");
                }
                obj.addProperty("totalRecord", totalRecord);
                obj.addProperty("totalRevenue", totalRevenue);                

            }
            
            queryStr = String.format("SELECT SUM(`amount`) AS `revenue`, COUNT(`app_trans_id`) AS `total_invoice`, MONTH(`payment_time`) AS `month`, YEAR(`payment_time`) AS `year` \n" +
                                     "FROM %s \n" +
                                     "%s \n"+
                                     "GROUP BY `month`, `year` DESC "
                                    + "LIMIT %s,%s", tableName, getWhereClauseSearch(app_id, fromDate, toDate), fromRecord, totalRecordPerPage);
            System.out.println("By month: " + queryStr);
            stmt.execute(queryStr);
            rs = stmt.getResultSet();             
            if (rs != null)
            {
                while (rs.next()) {
                   InvoiceSummary summary = new InvoiceSummary();
                   summary.setTotal_amount_zalopay_success(rs.getLong("revenue"));
                   summary.setTotal_invoice_zalopay_success(rs.getLong("total_invoice"));
                   totalInvoice += summary.getTotal_invoice_zalopay_success();
                   String month = rs.getString("month") + "-" + rs.getString("year");
                   summary.setMonth(month);
                   
                   listSummary.add(summary);
                }                
                ret = 0;
                obj.addProperty("totalInvoice", totalInvoice);
            }
            
        } catch (Exception ex) {
            ret = -1;
            logger.error(getClass().getSimpleName() + ".getSummaryInvoiceByMonth: " + ex.getMessage(), ex);
        } finally {
            MySqlFactory.safeClose(rs);
            MySqlFactory.safeClose(stmt);
            MySqlFactory.safeClose(connection);
        }
        
        return ret;
    }
}
