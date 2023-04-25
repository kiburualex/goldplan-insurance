/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.entity.InsurancePayment;
import com.dexni.goldplan.model.RequestFilterMapper;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.dexni.goldplan.repository.InsurancePaymentRepository;

/**
 *
 * @author kiburu
 */
@Slf4j
@Service("insurancePaymentsService")
public class InsurancePaymentsServiceImpl implements InsurancePaymentsService{
    @Autowired
    InsurancePaymentRepository  insurancePaymentsRepository;

    @Override
    public List<InsurancePayment> findAllInsurancePayments(){
        return insurancePaymentsRepository.findAll();
    }
    
    @Override
    public Page<InsurancePayment> findAllInsurancePayments(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        Pageable pageable = PageRequest.of(
                filter.getPageNumber(), 
                filter.getPageSize(), 
                Sort.by(filter.getSortBy()));
        Page<InsurancePayment> pagedResult = insurancePaymentsRepository.findWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch(),
                pageable);
         
         return pagedResult;
    }
    
    @Override
    public List<InsurancePayment> findAllUnpaginatedInsurancePayments(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        List<InsurancePayment> insurances = insurancePaymentsRepository.findUnpaginatedWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch());
         
         return insurances;
    }
    
    @Override
    public List<InsurancePayment> findInsurancePaymentsByIdsIn(List<Long> ids){
        return insurancePaymentsRepository.findByIdIn(ids);
    }

    @Override
    public Optional<InsurancePayment> findGoldplanPaymentById(Long id) {
        return insurancePaymentsRepository.findById(id);
    }
    
    @Override
    public InsurancePayment saveGoldplanPayment(InsurancePayment insurance) {
        return insurancePaymentsRepository.save(insurance);
    }
}
