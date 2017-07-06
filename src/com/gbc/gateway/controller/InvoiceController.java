/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.controller;

import com.gbc.gateway.common.CommonFunction;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import com.gbc.gateway.common.CommonModel;
import com.gbc.gateway.common.JsonParserUtil;
import com.gbc.gateway.data.Invoice;
import com.gbc.gateway.data.InvoiceSummary;
import com.gbc.gateway.model.InvoiceModel;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author tamvh
 */
public class InvoiceController extends HttpServlet{
    protected static final Logger logger = Logger.getLogger(InvoiceController.class);
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        handle(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        handle(req, resp);
    }
    
    private void handle(HttpServletRequest req, HttpServletResponse resp) {
        try {
            processs(req, resp);
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".handle: " + ex.getMessage(), ex);
        }
    }

    private void processs(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String pathInfo = (req.getPathInfo() == null) ? "" : req.getPathInfo();
        String cmd = req.getParameter("cm") != null ? req.getParameter("cm") : "";
        String data = req.getParameter("dt") != null ? req.getParameter("dt") : "";
        String content = "";
        
        pathInfo = pathInfo.toLowerCase();
        CommonModel.prepareHeader(resp, CommonModel.HEADER_JS);                
        
        switch (cmd) {
            case "pagination":
                logger.info("get list invoice: " + data);
                content = getInvoiceListOfPage(req, data);
                break;
            case "summary":
                logger.info("get summary: " + data);
                content = getSummary(req, data);
                break;
        }
        
        CommonModel.out(content, resp);
    }

    private String getInvoiceListOfPage(HttpServletRequest req, String data) {
        List<Invoice> listInvoicce = new ArrayList<>();
        String content;        
        int ret = -1;
        int currentPage = 0 ;
        int totalTransPerPage = 0;
        int paymentStatus = -10;
        int app_id = 0;
        String paymentDateTimeFrom = null;
        String paymentDateTimeTo = null;
        int length = 0;
        
        JsonObject jsonObject = JsonParserUtil.parseJsonObject(data);
        try {
            if(jsonObject == null){
                content = CommonModel.FormatResponse(ret, "Invalid parameter");
            } else{                               
                if(jsonObject.has("payment_status")){
                    paymentStatus = jsonObject.get("payment_status").getAsInt();
                }
                if(jsonObject.has("payment_date_time_from")){
                    paymentDateTimeFrom = jsonObject.get("payment_date_time_from").getAsString();
                }
                if(jsonObject.has("payment_date_time_to")){
                    paymentDateTimeTo = jsonObject.get("payment_date_time_to").getAsString();
                }
                if(jsonObject.has("current_page")){
                    currentPage = jsonObject.get("current_page").getAsInt();
                }
                if(jsonObject.has("total_trans_per_page")){
                    totalTransPerPage = jsonObject.get("total_trans_per_page").getAsInt();
                }
                if(jsonObject.has("app_id")){
                    app_id = jsonObject.get("app_id").getAsInt();
                }    
                
                InvoiceModel.getInstance().addPaymentData(
                        33, 
                        "Zalopay Integration", 
                        "1491282536480", 
                        10000, 
                        "170404120630", 
                        "170404000000353", 
                        "description", 
                        "cơm", 
                        "123456", 
                        "7cb893e443f0f9ed73467479ecb3b98227789418fb4bab153891b20ac74bb54c", 
                        "1491282536480", 
                        "1491282536480", 
                        1);
                
                if(currentPage > 0 && totalTransPerPage > 0){                
                    int fromRecord = currentPage*totalTransPerPage - totalTransPerPage;                    
                    ret = InvoiceModel.getInstance().getListInvoicePerPage(app_id, paymentStatus, paymentDateTimeFrom, paymentDateTimeTo, fromRecord, totalTransPerPage, listInvoicce);
                    length = listInvoicce.size();
                    
                }
            }
            if(ret == 0){                
                content = CommonModel.FormatResponse(ret, "", "length", length, "listInvoice", listInvoicce);
                
            } else{ 
                content = CommonModel.FormatResponse(ret, "Unsuccess");
            }
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".getInvoiceListOfPage: " + ex.getMessage(), ex);
            content = CommonModel.FormatResponse(ret, ex.getMessage());
        }
        return content;
    }

    private String getSummary(HttpServletRequest req, String data) {
        String content = "";
        int ret = -1;
        try{
            JsonObject jsonObj = JsonParserUtil.parseJsonObject(data);
            String fromDay = "";
            String toDay = "";
            int app_id = 0;
            int payment_status = -10;
            JsonObject summary_invoice = new JsonObject();
            if(jsonObj == null){
                content = CommonModel.FormatResponse(ret, "Invalid parameter");
            } else{               
                if(jsonObj.has("payment_date_time_from")){
                    fromDay = jsonObj.get("payment_date_time_from").getAsString();
                }
                if(jsonObj.has("payment_date_time_to")){
                    toDay = jsonObj.get("payment_date_time_to").getAsString();
                }
                if(jsonObj.has("app_id")){
                    app_id = jsonObj.get("app_id").getAsInt();
                }
                if(jsonObj.has("payment_status")){
                    payment_status = jsonObj.get("payment_status").getAsInt();
                }
                
                ret = InvoiceModel.getInstance().getSummaryInvoice(app_id, payment_status, fromDay, toDay, summary_invoice);
                
            }
            if(ret == 0){                
                content = CommonModel.FormatResponse(ret, "", summary_invoice);
            } else{ 
                content = CommonModel.FormatResponse(ret, "Unsuccess get summary in dashboard");
            }
        }catch(Exception ex){
            logger.error(getClass().getSimpleName() + ".getSummary: " + ex.getMessage(), ex);
            content = CommonModel.FormatResponse(-1, ex.getMessage());
        }
        return content;
    }
}
