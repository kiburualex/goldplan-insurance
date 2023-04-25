/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.entity.InsurancePayment;
import com.dexni.goldplan.model.RequestFilterMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

/**
 *
 * @author kiburu
 */
public interface InsurancePaymentsService {
    List<InsurancePayment> findAllInsurancePayments();
    
    Page<InsurancePayment> findAllInsurancePayments(RequestFilterMapper filter);
    
    List<InsurancePayment> findAllUnpaginatedInsurancePayments(RequestFilterMapper filter);
    
    List<InsurancePayment> findInsurancePaymentsByIdsIn(List<Long> ids);
    
    Optional<InsurancePayment> findGoldplanPaymentById(Long id);
    
    InsurancePayment saveGoldplanPayment(InsurancePayment insurance);
}
