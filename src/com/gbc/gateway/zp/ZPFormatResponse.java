/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.zp;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

/**
 *
 * @author haint3
 */
public class ZPFormatResponse {
    
    private static final Gson _gson = new GsonBuilder().create();
    public static final String RETURN_CODE = "returncode";
    public static final String RETURN_MESSAGE = "returnmessage";
    public static final String DATA    = "data";
    
    public static String format(int returncode, String returnmessage) {
                
        if (returncode == 0 && returnmessage.equals("")) {
            returnmessage = "No error";
        }
        
        JsonObject json = new JsonObject();
        json.addProperty(RETURN_CODE, returncode);
        json.addProperty(RETURN_MESSAGE, returnmessage);
        
        return _gson.toJson(json);
    }
    
    public static String format(int returncode, String returnmessage, String data) {
                
        if (returncode == 0 && returnmessage.equals("")) {
            returnmessage = "No error";
        }
        
        JsonObject json = new JsonObject();
        json.addProperty(RETURN_CODE, returncode);
        json.addProperty(RETURN_MESSAGE, returnmessage);
        json.addProperty(DATA, data);
        
        return _gson.toJson(json);
    }
    
    public static String format(int returncode, String returnmessage, Object objData) {
        
        if (returncode == 0 && returnmessage.equals("")) {
            returnmessage = "No error";
        }
        
        JsonObject json = new JsonObject();
        json.addProperty(RETURN_CODE, returncode);
        json.addProperty(RETURN_MESSAGE, returnmessage);
        json.add(DATA, _gson.toJsonTree(objData));
        
        return _gson.toJson(json);
    }
    
    public static String format(int returncode, String returnmessage, String objName, Object objData) {
        
        if (returncode == 0 && returnmessage.equals("")) {
            returnmessage = "No error";
        }
        
        JsonObject json = new JsonObject();
        json.addProperty(RETURN_CODE, returncode);
        json.addProperty(RETURN_MESSAGE, returnmessage);
        JsonObject jsonParent = new JsonObject();
        jsonParent.add(objName, _gson.toJsonTree(objData));
        json.add(DATA, jsonParent);
        
        return _gson.toJson(json);
    }
    
    public static String format(int returncode, String returnmessage, String objName1, Object objData1, String objName2, Object objData2) {
        
        if (returncode == 0 && returnmessage.equals("")) {
            returnmessage = "No error";
        }
        
        JsonObject json = new JsonObject();
        json.addProperty(RETURN_CODE, returncode);
        json.addProperty(RETURN_MESSAGE, returnmessage);
        JsonObject jsonParent = new JsonObject();
        jsonParent.add(objName1, _gson.toJsonTree(objData1));
        jsonParent.add(objName2, _gson.toJsonTree(objData2));
        json.add(DATA, jsonParent);
        
        return _gson.toJson(json);
    }
}
