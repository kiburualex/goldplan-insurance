/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.entity;

import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name = "insurance_payments")
@Data
@NoArgsConstructor
public class InsurancePayment implements Serializable{
    
    @Id
    @GeneratedValue
    private Long id;
    
    @Column(name = "customer_name")
    private String customerName;
    
    @Column(name = "customer_phone")
    private String customerPhoneNumber;
    
    @Column(name = "amount")
    private BigDecimal amount;
    
    @Column(name = "insurance_name")
    private String insuranceName;
    
    @Column(name = "paybill")
    private String paybill;

    @Column(name = "originator_converstion_id")
    private String originatorConverstionID;
    
    @Column(name = "conversation_id")
    private String conversationID;
    
    @Column(name = "transaction_receipt")
    private String mpesaReference;
    
     @Column(name = "customer_originator_converstion_id")
    private String customerOriginatorConverstionID;
    
    @Column(name = "customer_conversation_id")
    private String customerConversationID;
    
    @Column(name = "customer_transaction_receipt")
    private String customerMpesaReference;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "description")
    private String description;
    
    @ToString.Exclude
    @Column(name = "time_created", updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeCreated;
    
    @ToString.Exclude
    @Column(name = "time_updated")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeUpdated; 
    
}
