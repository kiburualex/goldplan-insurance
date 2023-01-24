/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.repository;

import com.dexni.goldplan.entity.Insurance;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author kiburu
 */

@Transactional
public interface InsuranceRepository extends JpaRepository<Insurance, Long>{
    
    @Query(""
            + "SELECT m FROM Insurance m WHERE "
            + " ( "
            + " lower(m.name) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.email) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " )"
            + " AND timeCreated BETWEEN to_date(:start,'YYYY-MM-DD') AND to_date(:end,'YYYY-MM-DD')"
            + " ORDER BY m.id DESC")
    public Page<Insurance> findWithFilter(
            @Param("start") String start, 
            @Param("end") String end, 
            @Param("search") String search, 
            Pageable pageable);
    
    @Query(""
            + "SELECT m FROM Insurance m WHERE "
            + " ( "
            + " lower(m.name) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR lower(m.email) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " )"
            + " AND timeCreated BETWEEN to_date(:start,'YYYY-MM-DD') AND to_date(:end,'YYYY-MM-DD')"
            + " ORDER BY m.id DESC")
    public List<Insurance> findUnpaginatedWithFilter(
            @Param("start") String start, 
            @Param("end") String end, 
            @Param("search") String search);
    
    @Query("SELECT m FROM Insurance m WHERE lower(name)=lower(:name)")
    public Optional<Insurance> findByName(@Param("name") String name);
    
    @Query("SELECT m FROM Insurance m WHERE lower(email)=lower(:email)")
    public Optional<Insurance> findByEmail(@Param("email") String email);
    
    @Query("SELECT m FROM Insurance m WHERE lower(paybill)=lower(:paybill)")
    public Optional<Insurance> findByPaybill(@Param("paybill") String paybill);
    
    List<Insurance> findByIdIn(List<Long> ids);
    
    int deleteByIdIn(List<Long> ids);
    
}
