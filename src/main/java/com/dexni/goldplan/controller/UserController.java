/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.controller;

import com.dexni.goldplan.dto.UserDTO;
import com.dexni.goldplan.entity.User;
import com.dexni.goldplan.model.MultipleIdsMapper;
import com.dexni.goldplan.model.RequestFilterMapper;
import com.dexni.goldplan.model.RequestMapper;
import com.dexni.goldplan.service.UserService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author kiburu
 */

@Slf4j
@RestController
@RequestMapping("/users")
public class UserController {
    final String path = "/users";
    
    @Autowired
    UserService userService;
    
    @GetMapping("")
    public ResponseEntity<?> listUsers(RequestMapper requestMapper, 
            HttpServletRequest request){
        log.info("GET {} session={} request={}", path, 
                request.getSession().getId(), requestMapper.toString());
        
        Map<String, Object> responseMap = userService.findAllUsers(requestMapper);
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @GetMapping("/ids")
    public ResponseEntity<?> listUserByIds(@RequestParam(required=true) List<Long> ids, HttpServletRequest request) {
        log.info("GET {}/ids session={} usersIds={}", path, request.getSession().getId(), ids.toString());
        
        List<UserDTO> users = userService.findUsersByIdsIn(ids);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("data", users);
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET {}/{} session={} ", path, id, request.getSession().getId());
        UserDTO user = userService.findUserById(id);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("data", user); 
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @PostMapping(path="",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE, 
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createUser(@ModelAttribute User userRequest, HttpServletRequest request) {
        log.info("POST {} session={} payload={}", path, request.getSession().getId(), userRequest.toString());

        UserDTO createdUser = userService.createUser(userRequest);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("message", "Created successfully");
        responseMap.put("data", createdUser);
        return new ResponseEntity<>(responseMap, HttpStatus.CREATED);
    }
    
    @PutMapping(path="/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE, 
            produces = MediaType.APPLICATION_JSON_VALUE )
    public ResponseEntity<?> updateUser(@PathVariable Long id, @ModelAttribute User userRequest, HttpServletRequest request) {
        log.info("PUT {}/{} session={} ", path, id, request.getSession().getId());

        UserDTO updatedUser = userService.updateUser(id, userRequest);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("message", "Updated successfully");
        responseMap.put("data", updatedUser);
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id, HttpServletRequest request){
        log.info("DELETE {}/{} session={}", path, id, request.getSession().getId());
        Map<String, Object> responseMap = new HashMap<>();
        UserDTO user = userService.findUserById(id);
        Boolean isDeleted = userService.deleteUserById(user.getId());
        if(!isDeleted){
            responseMap.put("message", "User ID "+ id +" not deleted");
            return new ResponseEntity<>(responseMap, HttpStatus.EXPECTATION_FAILED);
        }
        
        responseMap.put("message", "Deleted successfully");
        return new ResponseEntity<>(responseMap, HttpStatus.OK); 
    }
    
    @PutMapping("/ids")
    public ResponseEntity<?> deleteUsersByIds(@RequestBody MultipleIdsMapper idsMapper, HttpServletRequest request){
        log.info("PUT {}/ids session={} ids={}", path, request.getSession().getId(), idsMapper.getIds());
        
        Map<String, Object> responseMap = new HashMap<>();
        Boolean isDeleted = userService.deleteUsersByIds(idsMapper.getIds());
        if(!isDeleted){
            responseMap.put("message", "User IDs ["+ idsMapper.getIds().toString() +"] not deleted");
            return new ResponseEntity<>(responseMap, HttpStatus.EXPECTATION_FAILED);
        }
        
        responseMap.put("message", "Deleted successfully");
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
        
    }
}
