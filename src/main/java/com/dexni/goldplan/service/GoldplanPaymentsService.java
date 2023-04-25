/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.entity.GoldplanPayment;
import com.dexni.goldplan.model.RequestFilterMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

/**
 *
 * @author kiburu
 */
public interface GoldplanPaymentsService {
    
    List<GoldplanPayment> findAllGoldplanPayments();
    
    Page<GoldplanPayment> findAllGoldplanPayments(RequestFilterMapper filter);
    
    List<GoldplanPayment> findAllUnpaginatedGoldplanPayments(RequestFilterMapper filter);
    
    List<GoldplanPayment> findGoldplanPaymentsByIdsIn(List<Long> ids);
    
    Optional<GoldplanPayment> findGoldplanPaymentById(Long id);
    
    GoldplanPayment saveGoldplanPayment(GoldplanPayment insurance);
    
}
