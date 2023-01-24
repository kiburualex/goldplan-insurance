/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.entity.Insurance;
import com.dexni.goldplan.model.RequestFilterMapper;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

/**
 *
 * @author kiburu
 */
public interface InsuranceService {
    
    List<Insurance> findAllInsurances();
    
    Page<Insurance> findAllInsurances(RequestFilterMapper filter);
    
    List<Insurance> findAllUnpaginatedInsurances(RequestFilterMapper filter);
    
    List<Insurance> findInsurancesByIdsIn(List<Long> ids);
    
    Optional<Insurance> findInsuranceById(Long id);
    
    Optional<Insurance> findInsuranceByName(String name);
    
    Optional<Insurance> findInsuranceByEmail(String email);
    
    Optional<Insurance> findInsuranceByPaybill(String paybill);
    
    Insurance saveInsurance(Insurance insurance);
    
    Boolean deleteInsuranceById(Long id);
    
    Boolean deleteInsuranceByIds(List<Long> ids);
}
