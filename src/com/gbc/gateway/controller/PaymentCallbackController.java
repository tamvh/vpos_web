/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.controller;

import com.gbc.gateway.common.CommonModel;
import com.gbc.gateway.zp.cashout.ZPGatewayAPI;
import com.google.gson.Gson;
import java.io.IOException;
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
public class PaymentCallbackController extends HttpServlet {
    protected static final Logger logger = Logger.getLogger(PaymentCallbackController.class);
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
        String content = "";
        CommonModel.prepareHeader(resp, CommonModel.HEADER_JS);     

        try {
            String data = IOUtils.toString(req.getInputStream(), "UTF-8");
            logger.info("PaymentCallbackController.process: data = " + data);
            ZPGatewayAPI zpGatewayAPI= new ZPGatewayAPI();
            content = zpGatewayAPI.processPaymentCallback(data);
        } catch (IOException ex) {
            logger.error("PaymentCallbackController.process: ex = " + ex, ex);
        }
        
        CommonModel.out(content, resp);
    }
}
