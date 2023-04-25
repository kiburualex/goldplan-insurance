/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.dto.UserDTO;
import com.dexni.goldplan.dto.UserDTOMapper;
import com.dexni.goldplan.entity.User;
import com.dexni.goldplan.exceptions.BadRequestException;
import com.dexni.goldplan.exceptions.ResourceExistsException;
import com.dexni.goldplan.exceptions.ResourceNotFoundException;
import com.dexni.goldplan.model.RequestFilterMapper;
import com.dexni.goldplan.model.RequestMapper;
import com.dexni.goldplan.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author kiburu
 */

@Slf4j
@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final UserDTOMapper userDTOMapper;

    @Override
    public UserDTO findUserById(Long id) {
        return userRepository.findById(id)
                .map(userDTOMapper)
                .orElseThrow(
                        () -> new ResourceNotFoundException("User ID [" + id + "] not found"));
    }

    @Override
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Map findAllUsers(RequestMapper requestMapper) {
        RequestFilterMapper filterMapper = requestMapper.toFilterDTO();
        Map<String, Object> responseMap = new HashMap<>();
        List<UserDTO> users = new ArrayList<>();

        if (filterMapper.getNoPagination().equals(1)) {
            users = findAllUnPaginatedUsers(filterMapper)
                    .stream()
                    .map(userDTOMapper)
                    .collect(Collectors.toList());
            responseMap.put("data", users);
            return responseMap;
        }

        Page<User> paginatedContext = findAllPaginatedUsers(filterMapper);
        Map<String, Object> pageProfileMap = new HashMap<>();
        if (paginatedContext.hasContent()) {
            pageProfileMap.put("pageNumber", paginatedContext.getNumber());
            pageProfileMap.put("pageSize", paginatedContext.getSize());
            pageProfileMap.put("totalPages", paginatedContext.getTotalPages());
            pageProfileMap.put("totalElements", paginatedContext.getTotalElements());
            users = paginatedContext.getContent()
                    .stream()
                    .map(userDTOMapper)
                    .collect(Collectors.toList());
        }

        responseMap.put("pageProfile", pageProfileMap);
        responseMap.put("data", users);
        return responseMap;
    }

    private Page<User> findAllPaginatedUsers(RequestFilterMapper filter) {
        log.info("paginated filters pre-execution {}", filter.toString());
        Pageable pageable = PageRequest.of(
                filter.getPageNumber(),
                filter.getPageSize(),
                Sort.by(filter.getSortBy()));

        return userRepository.findWithFilter(
                filter.getStrStartDate(),
                filter.getStrEndDate(),
                filter.getSearch(),
                pageable);
    }

    private List<User> findAllUnPaginatedUsers(RequestFilterMapper filter) {
        log.info("un-paginated filters pre-execution {}", filter.toString());
        return userRepository.findUnPaginatedWithFilter(
                filter.getStrStartDate(),
                filter.getStrEndDate(),
                filter.getSearch());
    }

    @Override
    public List<UserDTO> findUsersByIdsIn(List<Long> ids) {

        if (null == ids || ids.isEmpty()) {
            throw new BadRequestException("User IDs is Empty");
        }

        return userRepository.findByIdIn(ids)
                .stream()
                .map(userDTOMapper)
                .collect(Collectors.toList());
    }

    @Override
    public Boolean deleteUserById(Long id) {
        userRepository.deleteById(id);
        return !userRepository.existsById(id);
    }

    @Override
    public Boolean deleteUsersByIds(List<Long> ids) {
        int affected = userRepository.deleteByIdIn(ids);
        return affected > 0;
    }

    @Override
    public UserDTO createUser(User userRequest) {
        Optional<String> name = Optional.ofNullable(userRequest.getName());
        Optional<String> email = Optional.ofNullable(userRequest.getEmail());
        Optional<String> phoneNumber = Optional.ofNullable(userRequest.getPhoneNumber());

        if (!name.isPresent()) {
            throw new BadRequestException("User name is empty");
        }

        if (!email.isPresent()) {
            throw new BadRequestException("User email is empty");
        }

        if (!phoneNumber.isPresent()) {
            throw new BadRequestException("User phone number is empty");
        }

        Optional<User> existingInsuranceByEmail = findUserByEmail(userRequest.getEmail());
        if (existingInsuranceByEmail.isPresent()) {
            throw new ResourceExistsException("User with email [" + userRequest.getEmail() + "] exists");
        }

        if (userRequest.getImage() != null) {
            try {
                userRequest.setAvatarContent(userRequest.getImage().getBytes());
                userRequest.setAvatarContentType((userRequest.getImage().getContentType()));
            } catch (IOException ex) {
                log.error("Error formatting image to bytes ", ex);
            }
        }

        userRequest.setTimeCreated(new Date());
        userRequest.setTimeUpdated(new Date());

        User savedUser = userRepository.save(userRequest);
        return userDTOMapper.apply(savedUser);
    }

    @Override
    public UserDTO updateUser(Long id, User userRequest) {
        Optional<String> name = Optional.ofNullable(userRequest.getName());
        Optional<String> email = Optional.ofNullable(userRequest.getEmail());
        Optional<String> phoneNumber = Optional.ofNullable(userRequest.getPhoneNumber());
        User user = userRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("User ID [" + id + "] not found"));

        if (!name.isPresent()) {
            throw new BadRequestException("User name is empty");
        }

        if (!email.isPresent()) {
            throw new BadRequestException("User email is empty");
        }

        if (!phoneNumber.isPresent()) {
            throw new BadRequestException("User phone number is empty");
        }

        Optional<User> existingUserByEmail = findUserByEmail(userRequest.getEmail());
        if (existingUserByEmail.isPresent() && !Objects.equals(user.getId(), existingUserByEmail.get().getId())) {
            throw new ResourceExistsException("User with email [" + userRequest.getEmail() + "] exists");
        }

        if (userRequest.getImage() != null) {
            try {
                user.setAvatarContent(userRequest.getImage().getBytes());
                user.setAvatarContentType((userRequest.getImage().getContentType()));
            } catch (IOException ex) {
                log.error("Error formating image to bytes ", ex);
            }
        } else {
            // set to null if no preview is available
            if (userRequest.getPreview() == null) {
                user.setAvatarContent(null);
                user.setAvatarContentType(null);
            }
        }

        user.setName(name.get());
        user.setEmail(email.get());
        user.setPhoneNumber(phoneNumber.get());
        user.setTimeUpdated(new Date());
        User savedUser = userRepository.save(user);
        return userDTOMapper.apply(savedUser);
    }

}
