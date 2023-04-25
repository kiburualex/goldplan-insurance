/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.repository;

import com.dexni.goldplan.entity.InsurancePayment;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author kiburu
 */
public interface InsurancePaymentRepository extends JpaRepository<InsurancePayment, Long>{
    @Query(""
            + "SELECT m FROM InsurancePayment m WHERE "
            + " ( "
            + " lower(m.customerName) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.customerPhoneNumber) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.originatorConverstionID) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.conversationID) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.description) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.insuranceName) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " )"
            + " AND timeCreated BETWEEN to_date(:start,'YYYY-MM-DD') AND to_date(:end,'YYYY-MM-DD')"
            + " ORDER BY m.id DESC")
    public Page<InsurancePayment> findWithFilter(
            @Param("start") String start, 
            @Param("end") String end, 
            @Param("search") String search, 
            Pageable pageable);
    
    @Query(""
            + "SELECT m FROM InsurancePayment m WHERE "
            + " ( "
            + " lower(m.customerName) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.customerPhoneNumber) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.originatorConverstionID) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.conversationID) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.description) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.insuranceName) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " )"
            + " AND timeCreated BETWEEN to_date(:start,'YYYY-MM-DD') AND to_date(:end,'YYYY-MM-DD')"
            + " ORDER BY m.id DESC")
    public List<InsurancePayment> findUnpaginatedWithFilter(
            @Param("start") String start, 
            @Param("end") String end, 
            @Param("search") String search);
    
    List<InsurancePayment> findByIdIn(List<Long> ids);
    
    int deleteByIdIn(List<Long> ids);
}
