/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.controller;

import com.dexni.goldplan.service.InsuranceService;
import com.dexni.goldplan.entity.Insurance;
import com.dexni.goldplan.exceptions.NotFoundException;
import com.dexni.goldplan.model.MultipleIdsMapper;
import com.dexni.goldplan.model.RequestFilterMapper;
import com.dexni.goldplan.model.RequestMapper;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/insurances")
public class InsuranceController {
    final String path = "/insurances";
    
    @Autowired
    InsuranceService insuranceService;
    
    @GetMapping("")
    public ResponseEntity<?> listInsurances(RequestMapper requestMapper, 
            HttpServletRequest request){
        log.info("GET {} session={} request={}", path, 
                request.getSession().getId(), requestMapper.toString());
        
        Map<String, Object> responseMap = new HashMap<>();
                
        RequestFilterMapper filterMapper = requestMapper.toFilterDTO();
        List<Insurance> insurances = new ArrayList<>();
        if(filterMapper.getNoPagination().equals(1)){
            insurances = insuranceService.findAllUnpaginatedInsurances(filterMapper);
        }else{
            Page<Insurance> ctrx = insuranceService.findAllInsurances(filterMapper);
            insurances = ctrx.hasContent() ? ctrx.getContent() : new ArrayList<>();
            
            
            Map<String, Object> pageProfileMap = new HashMap<>();
            if(ctrx.hasContent()){
                pageProfileMap.put("pageNumber", ctrx.getNumber());
                pageProfileMap.put("pageSize", ctrx.getSize());
                pageProfileMap.put("totalPages", ctrx.getTotalPages());
                pageProfileMap.put("totalElements", ctrx.getTotalElements());
            }
            
            responseMap.put("pageProfile", pageProfileMap);
        }
        
        responseMap.put("data", insurances);
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @GetMapping("/ids")
    public ResponseEntity<?> listInsurancesByIds(@RequestParam(required=true) List<Long> ids, HttpServletRequest request) {
        Map<String, Object> responseMap = new HashMap<>();
        
        if(null == ids || ids.isEmpty()){
            responseMap.put("message", "No Insurance ID");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        log.info("GET {}/ids session={} usersIds={}", path, request.getSession().getId(), ids.toString());
        
        List<Insurance> insurances = insuranceService.findInsurancesByIdsIn(ids);
        responseMap.put("data", insurances);
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getInsuranceById(@PathVariable Long id, HttpServletRequest request) {
        log.info("GET {}/{} session={} ", path, id, request.getSession().getId());
        Insurance insurance = insuranceService.findInsuranceById(id).orElseThrow(
                () -> new NotFoundException("Insurance ID [" + id + "] not found") );
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("data", insurance); 
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @PostMapping("")
    public ResponseEntity createInsurance(@RequestBody Insurance insuranceRequest, HttpServletRequest request) {
        log.info("POST {} session={} payload={}", path, request.getSession().getId(), insuranceRequest.toString());
        Map<String, Object> responseMap = new HashMap<>();
            
        if(null == insuranceRequest.getName() || insuranceRequest.getName().isEmpty()){
            responseMap.put("message", "Insurance name is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        if(null == insuranceRequest.getEmail() || insuranceRequest.getEmail().isEmpty()){
            responseMap.put("message", "Insurance email is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        if(null == insuranceRequest.getPaybill() || insuranceRequest.getPaybill().isEmpty()){
            responseMap.put("message", "Insurance paybill is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        if(null == insuranceRequest.getPhoneNumber() || insuranceRequest.getPhoneNumber().isEmpty()){
            responseMap.put("message", "Insurance phone number is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }

        Optional<Insurance> existingInsuranceByName = insuranceService.findInsuranceByName(insuranceRequest.getName());
        if(existingInsuranceByName.isPresent()){
            responseMap.put("message", "Insurance with name ["+ insuranceRequest.getName()+"] exists");
            return new ResponseEntity<>(responseMap, HttpStatus.FOUND);
        }

        Optional<Insurance> existingInsuranceByEmail = insuranceService.findInsuranceByEmail(insuranceRequest.getEmail());
        if(existingInsuranceByEmail.isPresent()){
            responseMap.put("message", "Insurance with email ["+ insuranceRequest.getEmail()+"] exists");
            return new ResponseEntity<>(responseMap, HttpStatus.FOUND);
        }
        
        Optional<Insurance> existingInsuranceByPaybill = insuranceService.findInsuranceByPaybill(insuranceRequest.getPaybill());
        if(existingInsuranceByPaybill.isPresent()){
            responseMap.put("message", "Insurance with paybill ["+ insuranceRequest.getPaybill()+"] exists");
            return new ResponseEntity<>(responseMap, HttpStatus.FOUND);
        }

        insuranceRequest.setTimeCreated(new Date());
        insuranceRequest.setTimeUpdated(new Date());

        Insurance savedInsurance = insuranceService.saveInsurance(insuranceRequest);
        if(null == savedInsurance){
            responseMap.put("message", "Error:: Creating Insurance [" + insuranceRequest.getName() + "] Failed.");
            return new ResponseEntity<>(responseMap, HttpStatus.EXPECTATION_FAILED);
        }

        // add logs activity
        /*
        String email = (String) request.getSession().getAttribute("email");
        if(null != email){
            Logs activity = new Logs();
            activity.setUserEmail(email);
            activity.setAction("create");
            activity.setDescription("Created Organization " + String.valueOf(org.getId())+ " successfully.");
            activity.setSourceIp("" + request.getRemoteAddr());
            activity.setNewData("" + org.toString());
            activity.setTimeCreated(NativeFuncs.getCurrentEntityDate());
            activity.setTimeUpdated(NativeFuncs.getCurrentEntityDate());
            logsService.save(activity);
        }
        */
        responseMap.put("message", "Created successfully");
        responseMap.put("data", savedInsurance);
        return new ResponseEntity<>(responseMap, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInsurance(@PathVariable Long id, @RequestBody Insurance insuranceRequest, HttpServletRequest request) {
        log.info("PUT {}/{} session={} ", path, id, request.getSession().getId());
        Map<String, Object> responseMap = new HashMap<>();
        Insurance insurance = insuranceService.findInsuranceById(id).orElseThrow(() -> new NotFoundException("Insurance ID [" + id + "] not found") );
    
        if(null == insuranceRequest.getName() || insuranceRequest.getName().isEmpty()){
            responseMap.put("message", "Insurance name is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        if(null == insuranceRequest.getEmail() || insuranceRequest.getEmail().isEmpty()){
            responseMap.put("message", "Insurance email is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        if(null == insuranceRequest.getPaybill() || insuranceRequest.getPaybill().isEmpty()){
            responseMap.put("message", "Insurance paybill is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        if(null == insuranceRequest.getPhoneNumber() || insuranceRequest.getPhoneNumber().isEmpty()){
            responseMap.put("message", "Insurance phone number is empty");
            return new ResponseEntity<>(responseMap, HttpStatus.BAD_REQUEST);
        }
        
        Optional<Insurance> existingInsuranceByName = insuranceService.findInsuranceByName(insuranceRequest.getName());
        if(existingInsuranceByName.isPresent() && insurance.getId() != existingInsuranceByName.get().getId()){
            responseMap.put("message", "Insurance with name ["+ insuranceRequest.getName()+"] exists");
            return new ResponseEntity<>(responseMap, HttpStatus.FOUND);
        }

        Optional<Insurance> existingInsuranceByEmail = insuranceService.findInsuranceByEmail(insuranceRequest.getEmail());
        if(existingInsuranceByEmail.isPresent() && insurance.getId() != existingInsuranceByEmail.get().getId()){
            responseMap.put("message", "Insurance with email ["+ insuranceRequest.getEmail()+"] exists");
            return new ResponseEntity<>(responseMap, HttpStatus.FOUND);
        }
        
        Optional<Insurance> existingInsuranceByPaybill = insuranceService.findInsuranceByPaybill(insuranceRequest.getPaybill());
        if(existingInsuranceByPaybill.isPresent() && insurance.getId() != existingInsuranceByPaybill.get().getId()){
            responseMap.put("message", "Insurance with paybill ["+ insuranceRequest.getPaybill()+"] exists");
            return new ResponseEntity<>(responseMap, HttpStatus.FOUND);
        }
        
        log.info("insurance {}", insurance.toString());
        insurance.setName(insuranceRequest.getName());
        insurance.setEmail(insuranceRequest.getEmail());
        insurance.setPaybill(insuranceRequest.getPaybill());
        insurance.setPhoneNumber(insurance.getPhoneNumber());
        insurance.setTimeUpdated(new Date());
        
        log.info("insurance {}", insurance.toString());
        
        Insurance savedInsurance = insuranceService.saveInsurance(insurance);
        if(null == savedInsurance){
            responseMap.put("message", "Error:: Creating Insurance [" + insuranceRequest.getName() + "] Failed.");
            return new ResponseEntity<>(responseMap, HttpStatus.EXPECTATION_FAILED);
        }
        
        responseMap.put("message", "Updated successfully");
        responseMap.put("data", savedInsurance);
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInsuranceById(@PathVariable Long id, HttpServletRequest request){
        log.info("DELETE {}/{} session={}", path, id, request.getSession().getId());
        Map<String, Object> responseMap = new HashMap<>();
        Insurance insurance = insuranceService.findInsuranceById(id).orElseThrow(() -> new NotFoundException("Insurance ID "+ id +" not found"));
        Boolean isDeleted = insuranceService.deleteInsuranceById(insurance.getId());
        if(!isDeleted){
            responseMap.put("message", "Insurance ID "+ id +" not deleted");
            return new ResponseEntity<>(responseMap, HttpStatus.EXPECTATION_FAILED);
        }
        
        responseMap.put("message", "Deleted successfully");
        return new ResponseEntity<>(responseMap, HttpStatus.OK); 
    }
    
    @PutMapping("/ids")
    public ResponseEntity<?> deleteInsuranceByIds(@RequestBody MultipleIdsMapper idsMapper, HttpServletRequest request){
        log.info("PUT {}/ids session={} ids={}", path, request.getSession().getId(), idsMapper.getIds());
        
        Map<String, Object> responseMap = new HashMap<>();
        Boolean isDeleted = insuranceService.deleteInsuranceByIds(idsMapper.getIds());
        if(!isDeleted){
            responseMap.put("message", "Insurance IDs ["+ idsMapper.getIds().toString() +"] not deleted");
            return new ResponseEntity<>(responseMap, HttpStatus.EXPECTATION_FAILED);
        }
        
        responseMap.put("message", "Deleted successfully");
        return new ResponseEntity<>(responseMap, HttpStatus.OK);
        
    }
}
