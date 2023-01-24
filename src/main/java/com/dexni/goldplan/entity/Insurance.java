/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 *
 * @author kiburu
 */
@Entity
@Table(name = "insurance")
@Data
@NoArgsConstructor
public class Insurance implements Serializable {
    
    @Id
    @GeneratedValue
    private long id;
    
    @Column(name = "name", unique=true)
    private String name;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phoneNumber")
    private String phoneNumber;
    
    @Column(name = "paybill")
    private String paybill;
    
    @ToString.Exclude
    @Column(name = "time_created", updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeCreated;
    
    @ToString.Exclude
    @Column(name = "time_updated")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeUpdated;   
}
