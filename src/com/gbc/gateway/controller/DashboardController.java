/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.controller;

import com.gbc.gateway.common.CommonModel;
import com.gbc.gateway.common.JsonParserUtil;
import static com.gbc.gateway.controller.InvoiceController.logger;
import com.gbc.gateway.data.InvoiceSummary;
import com.gbc.gateway.model.InvoiceModel;
import com.google.gson.JsonObject;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author tamvh
 */
public class DashboardController extends HttpServlet {
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
            case "summary":
                logger.info("get list trans: " + data);
                content = getSumOfDate(req, data);
                break;
        }
        
        CommonModel.out(content, resp);}

    private String getSumOfDate(HttpServletRequest req, String data) {
        String content = "";
        int ret = -1;
        try{
            InvoiceSummary summary = new InvoiceSummary();
            JsonObject jsonObj = JsonParserUtil.parseJsonObject(data);
            String toDay = "";
            int app_id = 0;
            int payment_status = -10;
            if(jsonObj == null){
                content = CommonModel.FormatResponse(ret, "Invalid parameter");
            } else{               
                if(jsonObj.has("today")){
                    toDay = jsonObj.get("today").getAsString();
                }
                if(jsonObj.has("app_id")){
                    app_id = jsonObj.get("app_id").getAsInt();
                }
                if(jsonObj.has("payment_status")){
                    payment_status = jsonObj.get("payment_status").getAsInt();
                }
                ret = InvoiceModel.getInstance().getSummaryInvoice(app_id, payment_status, toDay, toDay, summary);
                
            }
            if(ret == 0){                
                content = CommonModel.FormatResponse(ret, "", summary);
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
