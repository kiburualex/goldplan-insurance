/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.entity.Insurance;
import com.dexni.goldplan.model.RequestFilterMapper;
import com.dexni.goldplan.repository.InsuranceRepository;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Optional;

/**
 *
 * @author kiburu
 */
@Slf4j
@Service("insuranceService")
public class InsuranceServiceImpl implements InsuranceService{
    
    InsuranceRepository insuranceRepository;
    
    public InsuranceServiceImpl(InsuranceRepository insuranceRepository){
        this.insuranceRepository = insuranceRepository;
    }
    
    @Override
    public List<Insurance> findAllInsurances(){
        return insuranceRepository.findAll();
    }
    
    @Override
    public Page<Insurance> findAllInsurances(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        Pageable pageable = PageRequest.of(
                filter.getPageNumber(), 
                filter.getPageSize(), 
                Sort.by(filter.getSortBy()));
        Page<Insurance> pagedResult = insuranceRepository.findWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch(),
                pageable);
         
         return pagedResult;
    }
    
    @Override
    public List<Insurance> findAllUnpaginatedInsurances(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        List<Insurance> insurances = insuranceRepository.findUnpaginatedWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch());
         
         return insurances;
    }
    
    @Override
    public List<Insurance> findInsurancesByIdsIn(List<Long> ids){
        return insuranceRepository.findByIdIn(ids);
    }

    @Override
    public Optional<Insurance> findInsuranceById(Long id) {
        return insuranceRepository.findById(id);
    }
    
    @Override
    public Optional<Insurance> findInsuranceByName(String name) {
        return insuranceRepository.findByName(name);
    }
    
    @Override
    public Optional<Insurance> findInsuranceByEmail(String email) {
        return insuranceRepository.findByEmail(email);
    }
    
    @Override
    public Optional<Insurance> findInsuranceByPaybill(String paybill) {
        return insuranceRepository.findByPaybill(paybill);
    }
    
    @Override
    public Insurance saveInsurance(Insurance insurance) {
        return insuranceRepository.save(insurance);
    }
    
    @Override
    public Boolean deleteInsuranceById(Long id) {
        insuranceRepository.deleteById(id);
        return !insuranceRepository.existsById(id);
    }
    
    @Override
    public Boolean deleteInsuranceByIds(List<Long> ids) {
        int affected = insuranceRepository.deleteByIdIn(ids);
        return affected > 0;
    }
}
