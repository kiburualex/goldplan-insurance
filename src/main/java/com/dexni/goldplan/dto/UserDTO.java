package com.dexni.goldplan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
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
    @Lob
    @Column(name = "avatar_content")
    private byte[] avatarContent;

    @Column(name = "avatar_content_type")
    private String avatarContentType;

    @ToString.Exclude
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeCreated;

    @ToString.Exclude
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeUpdated;

    private String status;

}
