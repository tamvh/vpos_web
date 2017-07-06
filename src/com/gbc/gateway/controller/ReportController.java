/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.controller;

import com.gbc.gateway.common.AppConst;
import com.gbc.gateway.common.CommonFunction;
import com.gbc.gateway.common.CommonModel;
import com.gbc.gateway.common.JsonParserUtil;
import com.gbc.gateway.data.InvoiceSummary;
import com.gbc.gateway.model.ReportModel;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;

/**
 *
 * @author tamvh
 */
public class ReportController extends HttpServlet{
    protected final Logger logger = Logger.getLogger(this.getClass());
    private static Gson gson = new Gson();

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

        
//        if (CommonFunction.checkSession(req) == false) {
//            content = CommonModel.FormatResponse(AppConst.ERROR_NOT_LOGIN, "have not logged in");
//            CommonModel.out(content, resp);
//            return;
//        }        

        switch (cmd) {
            case "report_by_month":
                content = getReportByMonthOfPage(data);
                break;
            case "report_by_date":
                content = getReportByDateOfPage(data);
                break;
        }

        CommonModel.out(content, resp);
    }

    private String getReportByMonthOfPage(String data) {
        String content;        
        int ret = -1;       
        int app_id = 0;
        String fromMonth = null;
        String toMonth = null;
        JsonObject jsonObject = JsonParserUtil.parseJsonObject(data);
        List<InvoiceSummary> listSummary = new ArrayList<>();
        int totalRecordPerPage = 0;
        int currentPage = 0;
        
        JsonObject obj = new JsonObject();
        
        try {
            if(jsonObject == null){
                content = CommonModel.FormatResponse(ret, "Invalid parameter");
            } else{
                if(jsonObject.has("app_id")) {
                    app_id = jsonObject.get("app_id").getAsInt();
                } else {
                    content = CommonModel.FormatResponse(ret, "Invalid parameter");
                    return content;
                }
               
                if(jsonObject.has("from")){
                    fromMonth = jsonObject.get("from").getAsString();
                }
                if(jsonObject.has("to")){
                    toMonth = jsonObject.get("to").getAsString();
                }
                if(jsonObject.has("current_page")){
                    currentPage = jsonObject.get("current_page").getAsInt();
                }
                if(jsonObject.has("total_record_per_page")){
                    totalRecordPerPage = jsonObject.get("total_record_per_page").getAsInt();
                }
                if(currentPage > 0 && totalRecordPerPage > 0){                
                    int fromRecord = currentPage*totalRecordPerPage - totalRecordPerPage;                    
                    ret = ReportModel.getInstance().getReportByMonthPerPage(app_id, fromMonth, toMonth, fromRecord, totalRecordPerPage, listSummary, obj);                    
                }                
                
            }
            if(ret == 0){
                JsonObject res = new JsonObject();
                res.add("listSummary", gson.toJsonTree(listSummary));
                res.addProperty("totalRecord", obj.get("totalRecord").getAsLong());
                res.addProperty("totalInvoice", obj.get("totalInvoice").getAsLong());
                res.addProperty("totalRevenue", obj.get("totalRevenue").getAsLong());
                content = CommonModel.FormatResponse(ret, "", res);
            } else{ 
                content = CommonModel.FormatResponse(ret, "Unsuccess get invoice by month");
            }
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".getReportByMonthOfPage: " + ex.getMessage(), ex);
            content = CommonModel.FormatResponse(ret, ex.getMessage());
        }
        return content;  
    }

    private String getReportByDateOfPage(String data) {
        String content;        
        int ret = -1;        
        int app_id = 0;
        String fromDate = null;
        String toDate = null;
        JsonObject jsonObject = JsonParserUtil.parseJsonObject(data);
        List<InvoiceSummary> listSummary = new ArrayList<>();
        JsonObject objTotal = new JsonObject();
        int totalRecordPerPage = 0;
        
        int currentPage = 0;
        try {
            if(jsonObject == null){
                content = CommonModel.FormatResponse(ret, "Invalid parameter");
            } else{
                if(jsonObject.has("app_id")) {
                    app_id = jsonObject.get("app_id").getAsInt();
                } else {
                    content = CommonModel.FormatResponse(ret, "Invalid parameter");
                    return content;
                }               
                if(jsonObject.has("from_date")){
                    fromDate = jsonObject.get("from_date").getAsString();
                }
                if(jsonObject.has("to_date")){
                    toDate = jsonObject.get("to_date").getAsString();
                }
                if(jsonObject.has("current_page")){
                    currentPage = jsonObject.get("current_page").getAsInt();
                }
                if(jsonObject.has("total_record_per_page")){
                    totalRecordPerPage = jsonObject.get("total_record_per_page").getAsInt();
                }
                if(currentPage > 0 && totalRecordPerPage > 0){                
                    int fromRecord = currentPage*totalRecordPerPage - totalRecordPerPage;                    
                    ret = ReportModel.getInstance().getReportByDatePerPage(app_id, fromDate, toDate, fromRecord, totalRecordPerPage, listSummary, objTotal);                    
                }

            }
            if(ret == 0){
                JsonObject res = new JsonObject();
                res.add("listSummary", gson.toJsonTree(listSummary));
                res.addProperty("totalRecord", objTotal.get("totalRecord").getAsLong());
                res.addProperty("totalRevenue", objTotal.get("totalRevenue").getAsLong());
                res.addProperty("totalInvoice", objTotal.get("totalInvoice").getAsLong());
                content = CommonModel.FormatResponse(ret, "", res);
            } else{ 
                content = CommonModel.FormatResponse(ret, "Unsuccess get invoice by month");
            }
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".getReportByDateOfPage: " + ex.getMessage(), ex);
            content = CommonModel.FormatResponse(ret, ex.getMessage());
        }
        return content;
    }
}
