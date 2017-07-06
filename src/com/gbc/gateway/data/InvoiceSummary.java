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
public class InvoiceSummary {
    private long total_invoice_zalopay = 0;
    private long total_invoice_zalopay_success = 0;
    private long total_invoice_zalopay_fail = 0;
    private long total_amount_zalopay = 0;
    private long total_amount_zalopay_success = 0;
    private long total_amount_zalopay_fail = 0;
    private long total_user_zalopay = 0;
    private long total_user_zalopay_success = 0;
    private long total_user_zalopay_fail = 0;
    
    private String month; //summary theo tháng
    private String date;// summary theo ngày
    
    public void setTotal_invoice_zalopay(long total_invoice_zalopay) {
        this.total_invoice_zalopay = total_invoice_zalopay;
    }
    
    public void setTotal_invoice_zalopay_success(long total_invoice_zalopay_success) {
        this.total_invoice_zalopay_success = total_invoice_zalopay_success;
    }
    
    public  void setTotal_invoice_zalopay_fail(long total_invoice_zalopay_fail) {
        this.total_invoice_zalopay_fail = total_invoice_zalopay_fail;
    }
    
    public void setTotal_amount_zalopay(long total_amount_zalopay) {
        this.total_amount_zalopay = total_amount_zalopay;
    }
    
    public void setTotal_amount_zalopay_success(long total_amount_zalopay_success) {
        this.total_amount_zalopay_success = total_amount_zalopay_success;
    }
    
    public void setTotal_amount_zalopay_fail(long total_amount_zalopay_fail) {
        this.total_amount_zalopay_fail = total_amount_zalopay_fail;
    }
    
    public void setTotal_user_zalopay(long total_user_zalopay) {
        this.total_user_zalopay = total_user_zalopay;
    }
    
    public void setTotal_user_zalopay_success(long total_user_zalopay_success) {
        this.total_user_zalopay_success = total_user_zalopay_success;
    }
    
    public void setTotal_user_zalopay_fail(long total_user_zalopay_fail) {
        this.total_user_zalopay_fail = total_user_zalopay_fail;
    }
    
    public long getTotal_invoice_zalopay() {
        return total_invoice_zalopay;
    }
    
    public long getTotal_invoice_zalopay_success() {
        return total_invoice_zalopay_success;
    }
    
    public long getTotal_invoice_zalopay_fail() {
        return total_invoice_zalopay_fail;
    }
    
    public long getTotal_amount_zalopay() {
        return total_amount_zalopay;
    }
    
    public long getTotal_amount_zalopay_success() {
        return total_amount_zalopay_success;
    }
    
    public long getTotal_amount_zalopay_fail() {
        return total_amount_zalopay_fail;
    }
    
    public long getTotal_user_zalopay() {
        return total_user_zalopay;
    }
    
    public long getTotal_user_zalopay_success() {
        return total_user_zalopay_success;
    }
    
    public long getTotal_user_zalopay_fail() {
        return total_user_zalopay_fail;
    }
    
    /**
     * @return the month
     */
    public String getMonth() {
        return month;
    }

    /**
     * @param month the month to set
     */
    public void setMonth(String month) {
        this.month = month;
    }

    /**
     * @return the date
     */
    public String getDate() {
        return date;
    }

    /**
     * @param date the date to set
     */
    public void setDate(String date) {
        this.date = date;
    }
}
