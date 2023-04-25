/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.entity.GoldplanPayment;
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
import com.dexni.goldplan.repository.GoldplanPaymentRepository;

/**Long
 *
 * @author kiburu
 */
@Slf4j
@Service("goldplanPaymentsService")
public class GoldplanPaymentsServiceImpl implements GoldplanPaymentsService{
    
    @Autowired
    GoldplanPaymentRepository  goldplanPaymentsRepository;

    @Override
    public List<GoldplanPayment> findAllGoldplanPayments(){
        return goldplanPaymentsRepository.findAll();
    }
    
    @Override
    public Page<GoldplanPayment> findAllGoldplanPayments(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        Pageable pageable = PageRequest.of(
                filter.getPageNumber(), 
                filter.getPageSize(), 
                Sort.by(filter.getSortBy()));
        Page<GoldplanPayment> pagedResult = goldplanPaymentsRepository.findWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch(),
                pageable);
         
         return pagedResult;
    }
    
    @Override
    public List<GoldplanPayment> findAllUnpaginatedGoldplanPayments(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        List<GoldplanPayment> insurances = goldplanPaymentsRepository.findUnpaginatedWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch());
         
         return insurances;
    }
    
    @Override
    public List<GoldplanPayment> findGoldplanPaymentsByIdsIn(List<Long> ids){
        return goldplanPaymentsRepository.findByIdIn(ids);
    }

    @Override
    public Optional<GoldplanPayment> findGoldplanPaymentById(Long id) {
        return goldplanPaymentsRepository.findById(id);
    }
    
    @Override
    public GoldplanPayment saveGoldplanPayment(GoldplanPayment insurance) {
        return goldplanPaymentsRepository.save(insurance);
    }

}
