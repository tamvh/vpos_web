/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.controller;

import com.gbc.gateway.common.CommonFunction;
import com.gbc.gateway.common.CommonModel;
import com.gbc.gateway.zp.cashout.ZPGatewayAPI;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;

/**
 *
 * @author haint3
 */
public class ZPCreateOrderController extends HttpServlet {
    protected static final Logger logger = Logger.getLogger(ZPCreateOrderController.class);
    private static Gson _gson = new Gson();
    
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
        //String data = req.getParameter(ZPFormatResponse.DATA) != null ? req.getParameter(ZPFormatResponse.DATA) : "";
        String content = "";
        CommonModel.prepareHeader(resp, CommonModel.HEADER_JS);     
        
        Map<String, String> paramMap = CommonFunction.convertQueryMap(req.getParameterMap());
        ZPGatewayAPI zpGatewayAPI = new ZPGatewayAPI();
        content = zpGatewayAPI.createOrder(paramMap);
        
        CommonModel.out(content, resp);
    }
}
