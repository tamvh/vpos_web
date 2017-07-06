/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gbc.gateway.redis;

import com.lambdaworks.redis.RedisClient;
import com.lambdaworks.redis.RedisConnectionException;
import com.lambdaworks.redis.api.StatefulRedisConnection;
import com.lambdaworks.redis.codec.Utf8StringCodec;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import org.apache.log4j.Logger;

/**
 *
 * @author haint3
 */
public class ZRedisClient {
    private static final Logger logger = Logger.getLogger(ZRedisClient.class);
    private static ZRedisClient _instance = null;
    private static final Lock createLock_ = new ReentrantLock();
    public RedisClient _client = null;
    private StatefulRedisConnection<String, String> _asynStringCommands = null;
    
    public static ZRedisClient getInstance() {
        if (_instance == null) {
            createLock_.lock();
            try {
                if (_instance == null) {
                    _instance = new ZRedisClient();
                }
            } finally {
                createLock_.unlock();
            }
        }
        return _instance;
    }
    
    public void start(String uri) throws Exception {
        try {
            if (_client == null) {
                _client = RedisClient.create(uri);
                _asynStringCommands = _client.connect(new Utf8StringCodec());
            }
        } catch (RedisConnectionException ex) {
            throw new Exception("Cannot connect to Redis server. URI " + uri);
        }
    }
    
    public void stop() {
        if (_client != null) {
            try {
                _asynStringCommands.close();
                _client.shutdown();
            } catch (Exception ex) {
                logger.error("ZRedisClient.stop", ex);
            }
        }
    }
    
    public StatefulRedisConnection<String, String> getStringCommand() {
        return _asynStringCommands;
    }
}
