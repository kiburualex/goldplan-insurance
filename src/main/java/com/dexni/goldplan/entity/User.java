/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.context.annotation.Role;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author kiburu
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User implements Serializable {

    @Id
    @GeneratedValue
    private Long id;
    
    @Column(name = "name")
    private String name;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @ToString.Exclude
    @Column(name = "password")
    private String password;
        
    @ToString.Exclude
    @Lob
    @Column(name = "avatar_content")
    private byte[] avatarContent;
    
    @Column(name = "avatar_content_type")
    private String avatarContentType;
        
    @ToString.Exclude
    @Column(name = "time_created", updatable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeCreated;
    
    @ToString.Exclude
    @Column(name = "time_updated")
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeUpdated;
    
    @Column(name = "status")
    private String status;
    
    @ToString.Exclude
    @Transient
    private List<Role> roles;
    
    @ToString.Exclude
    @Transient
    private MultipartFile image;
    
    @ToString.Exclude
    @Transient
    private byte[] preview;

    public User(long id) {
        this.id = id;
    }
    
}