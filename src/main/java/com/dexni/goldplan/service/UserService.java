/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.dto.UserDTO;
import com.dexni.goldplan.entity.User;
import com.dexni.goldplan.model.RequestFilterMapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.dexni.goldplan.model.RequestMapper;
import org.springframework.data.domain.Page;

/**
 *
 * @author kiburu
 */
public interface UserService {

    UserDTO findUserById(Long id);
    
    Optional<User> findUserByEmail(String email);
    
    List<User> findAllUsers();

    Map findAllUsers(RequestMapper requestMapper);
    
    List<UserDTO> findUsersByIdsIn(List<Long> ids);
    
    Boolean deleteUserById(Long id) ;
    
    Boolean deleteUsersByIds(List<Long> ids);

    UserDTO createUser(User userRequest);

    UserDTO updateUser(Long id, User userRequest);

}
