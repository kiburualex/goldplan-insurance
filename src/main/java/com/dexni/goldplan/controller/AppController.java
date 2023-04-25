
package com.dexni.goldplan.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author kiburu
 */
@RestController
@RequestMapping("/app")
@Slf4j
public class AppController {
    
    final String path = "/app";
    
    @RequestMapping("/")
    public ResponseEntity ping(HttpServletRequest request) throws JsonProcessingException{
        String sessionId = request.getSession().getId();
        log.info("{} sessionId={}", path, sessionId);
        Map<String, Object> response = new HashMap<>();
        List<String> tt = new ArrayList<>();
        tt.add("Alex");
        tt.add("Kiburu");
        tt.add("Muriithi");
        response.put("data", tt);
        response.put("ResponseCode", "00");
        response.put("ResponseDescription", "Success");
        log.info("{} sessionId={} response={}", path, sessionId, response);
        return new ResponseEntity(response, HttpStatus.OK);
    }
    
}
