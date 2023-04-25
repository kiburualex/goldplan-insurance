/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.service;

import com.dexni.goldplan.entity.Insurance;
import com.dexni.goldplan.exceptions.BadRequestException;
import com.dexni.goldplan.exceptions.ExpectationFailedException;
import com.dexni.goldplan.exceptions.ResourceExistsException;
import com.dexni.goldplan.exceptions.ResourceNotFoundException;
import com.dexni.goldplan.model.RequestFilterMapper;
import com.dexni.goldplan.repository.InsuranceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 *
 * @author kiburu
 */
@Slf4j
@Service("insuranceService")
public class InsuranceServiceImpl implements InsuranceService{
    
    @Autowired
    InsuranceRepository insuranceRepository;

    @Override
    public List<Insurance> findAllInsurances(){
        return insuranceRepository.findAll();
    }
    
    @Override
    public Page<Insurance> findAllInsurances(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        Pageable pageable = PageRequest.of(
                filter.getPageNumber(), 
                filter.getPageSize(), 
                Sort.by(filter.getSortBy()));
        Page<Insurance> pagedResult = insuranceRepository.findWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch(),
                pageable);
         
         return pagedResult;
    }
    
    @Override
    public List<Insurance> findAllUnpaginatedInsurances(RequestFilterMapper filter){
        
        log.info("filters pre-execution {}", filter.toString());
        List<Insurance> insurances = insuranceRepository.findUnpaginatedWithFilter(
                filter.getStrStartDate(), 
                filter.getStrEndDate(), 
                filter.getSearch());
         
         return insurances;
    }
    
    @Override
    public List<Insurance> findInsurancesByIdsIn(List<Long> ids){
        if(null == ids || ids.isEmpty()){
            throw new BadRequestException("Insurance IDs is Empty");
        }

        return insuranceRepository.findByIdIn(ids);
    }

    @Override
    public Insurance findInsuranceById(Long id) {
        return insuranceRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Insurance ID [" + id + "] not found") );
    }
    
    @Override
    public Optional<Insurance> findInsuranceByName(String name) {
        return insuranceRepository.findByName(name);
    }
    
    @Override
    public Optional<Insurance> findInsuranceByEmail(String email) {
        return insuranceRepository.findByEmail(email);
    }
    
    @Override
    public Optional<Insurance> findInsuranceByPaybill(String paybill) {
        return insuranceRepository.findByPaybill(paybill);
    }

    @Override
    public Insurance createInsurance(Insurance insurance) {

        if(null == insurance.getName() || insurance.getName().isEmpty()){
            throw new BadRequestException("Insurance name is empty");
        }

        if(null == insurance.getEmail() || insurance.getEmail().isEmpty()){
            throw new BadRequestException("Insurance email is empty");
        }

        if(null == insurance.getPaybill() || insurance.getPaybill().isEmpty()){
            throw new BadRequestException("Insurance pay-bill is empty");
        }

        if(null == insurance.getPhoneNumber() || insurance.getPhoneNumber().isEmpty()){
            throw new BadRequestException("Insurance phone number is empty");
        }

        Optional<Insurance> existingInsuranceByName = findInsuranceByName(insurance.getName());
        if(existingInsuranceByName.isPresent()){
            throw new ResourceExistsException("Insurance with name ["+ insurance.getName()+"] exists");
        }

        Optional<Insurance> existingInsuranceByEmail = findInsuranceByEmail(insurance.getEmail());
        if(existingInsuranceByEmail.isPresent()){
            throw new ResourceExistsException("Insurance with email ["+ insurance.getEmail()+"] exists");
        }

        Optional<Insurance> existingInsuranceByPaybill = findInsuranceByPaybill(insurance.getPaybill());
        if(existingInsuranceByPaybill.isPresent()){
            throw new ResourceExistsException("Insurance with paybill ["+ insurance.getPaybill()+"] exists");
        }

        insurance.setTimeCreated(new Date());
        insurance.setTimeUpdated(new Date());

        Insurance savedInsurance = insuranceRepository.save(insurance);
        if(null == savedInsurance){
            throw new ExpectationFailedException("Error:: Creating Insurance [" + insurance.getName() + "] Failed.");
        }

        return savedInsurance;
    }

    @Override
    public Insurance updateInsurance(Long id, Insurance insuranceRequest) {

        Insurance insurance = findInsuranceById(id);

        if(null == insuranceRequest.getName() || insuranceRequest.getName().isEmpty()){
            throw new BadRequestException("Insurance name is empty");
        }

        if(null == insuranceRequest.getEmail() || insuranceRequest.getEmail().isEmpty()){
            throw new BadRequestException("Insurance email is empty");
        }

        if(null == insuranceRequest.getPaybill() || insuranceRequest.getPaybill().isEmpty()){
            throw new BadRequestException("Insurance pay-bill is empty");
        }

        if(null == insuranceRequest.getPhoneNumber() || insuranceRequest.getPhoneNumber().isEmpty()){
            throw new BadRequestException("Insurance phone number is empty");
        }

        Optional<Insurance> existingInsuranceByName = findInsuranceByName(insuranceRequest.getName());
        if(existingInsuranceByName.isPresent() && !Objects.equals(insurance.getId(), existingInsuranceByName.get().getId())) {
            throw new ResourceExistsException("Insurance with name [" + insuranceRequest.getName() + "] exists");
        }

        Optional<Insurance> existingInsuranceByEmail = findInsuranceByEmail(insuranceRequest.getEmail());
        if(existingInsuranceByEmail.isPresent() && !Objects.equals(insurance.getId(), existingInsuranceByEmail.get().getId())) {
            throw new ResourceExistsException("Insurance with email [" + insuranceRequest.getEmail() + "] exists");
        }

        Optional<Insurance> existingInsuranceByPaybill = findInsuranceByPaybill(insuranceRequest.getPaybill());
        if(existingInsuranceByPaybill.isPresent() && !Objects.equals(insurance.getId(), existingInsuranceByPaybill.get().getId())){
            throw new ResourceExistsException("Insurance with pay-bill [" + insuranceRequest.getPaybill() + "] exists");
        }

        insurance.setName(insuranceRequest.getName());
        insurance.setEmail(insuranceRequest.getEmail());
        insurance.setPaybill(insuranceRequest.getPaybill());
        insurance.setPhoneNumber(insurance.getPhoneNumber());
        insurance.setTimeUpdated(new Date());

        insuranceRepository.save(insurance);
        if(null == insurance){
            throw new ExpectationFailedException("Error:: Updating Insurance [" + insurance.getName() + "] Failed.");
        }

        return insurance;
    }
    
    @Override
    public Boolean deleteInsuranceById(Long id) {
        insuranceRepository.deleteById(id);
        return !insuranceRepository.existsById(id);
    }
    
    @Override
    public Boolean deleteInsurancesByIds(List<Long> ids) {
        int affected = insuranceRepository.deleteByIdIn(ids);
        return affected > 0;
    }
}
