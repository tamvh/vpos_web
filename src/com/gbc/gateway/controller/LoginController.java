/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.controller;

import com.gbc.gateway.common.AppConst;
import com.gbc.gateway.common.CommonFunction;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.log4j.Logger;
import com.gbc.gateway.common.CommonModel;
import com.gbc.gateway.common.JsonParserUtil;
import com.gbc.gateway.common.LocalServiceAPI;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
/**
 *
 * @author tamvh
 */
public class LoginController extends HttpServlet {
    protected final Logger logger = Logger.getLogger(this.getClass());
    
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
        String cmd = req.getParameter("cm") != null ? req.getParameter("cm") : "";
        String data = req.getParameter("dt") != null ? req.getParameter("dt") : "";
        String content = "";
            
        CommonModel.prepareHeader(resp, CommonModel.HEADER_JS);
        
        switch (cmd) {            
            case "logout":
                content = logout(req);
                break;
            case "verify":
                content = verifyLogin(req, data);
                break;
        }
        
        CommonModel.out(content, resp);
    }

    private String logout(HttpServletRequest req) {
        String content;
        int ret = AppConst.ERROR_GENERIC;
        
        try {
            CommonFunction.deleteSession(req);
            content = CommonModel.FormatResponse(AppConst.NO_ERROR, "");
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".logout: " + ex.getMessage(), ex);
            content = CommonModel.FormatResponse(ret, ex.getMessage());
        }
        
        return content;
    }

    private String verifyLogin(HttpServletRequest req, String data) {
        String content = null;
        int ret = AppConst.ERROR_GENERIC;
        
        try {
            JsonObject jsonObject = JsonParserUtil.parseJsonObject(data);
            if (jsonObject == null) {
                content = CommonModel.FormatResponse(ret, "Invalid parameter");
            } else {
                
                String sessionId = jsonObject.get("sid").getAsString();
                
                if (sessionId.isEmpty()) {
                    content = CommonModel.FormatResponse(ret, "Invalid parameter");
                } else {
                    
                }
            }
        } catch (Exception ex) {
            logger.error(getClass().getSimpleName() + ".verifyLogin: " + ex.getMessage(), ex);
            content = CommonModel.FormatResponse(ret, ex.getMessage());
        }
        
        return content;
    }
}
