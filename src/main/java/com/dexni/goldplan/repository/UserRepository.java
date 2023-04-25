/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.repository;

import com.dexni.goldplan.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author kiburu
 */
public interface UserRepository extends JpaRepository<User, Long>{
    @Query(""
            + "SELECT m FROM User m WHERE "
            + " ( "
            + " lower(m.name) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR "
            + " lower(m.email) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " )"
            + " AND m.timeCreated BETWEEN to_date(:start,'YYYY-MM-DD') AND to_date(:end,'YYYY-MM-DD')"
            + " ORDER BY m.id DESC")
    Page<User> findWithFilter(
            @Param("start") String start, 
            @Param("end") String end, 
            @Param("search") String search, 
            Pageable pageable);
    
    @Query(""
            + "SELECT m FROM User m WHERE "
            + " ( "
            + " lower(m.name) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " OR "
            + " lower(m.email) LIKE (CASE WHEN :search IS NULL THEN lower(concat('%', '','%')) ELSE lower(concat('%', :search,'%')) END) "
            + " )"
            + " AND m.timeCreated BETWEEN to_date(:start,'YYYY-MM-DD') AND to_date(:end,'YYYY-MM-DD')"
            + " ORDER BY m.id DESC")
    List<User> findUnPaginatedWithFilter(
            @Param("start") String start, 
            @Param("end") String end, 
            @Param("search") String search);
    
    @Query("SELECT m FROM User m WHERE lower(m.email)=lower(:email)")
    Optional<User> findByEmail(@Param("email") String email);
    
    List<User> findByIdIn(List<Long> ids);
    
    int deleteByIdIn(List<Long> ids);
}
