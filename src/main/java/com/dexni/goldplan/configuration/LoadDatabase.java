/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.configuration;


import com.dexni.goldplan.entity.Insurance;
import com.dexni.goldplan.repository.InsuranceRepository;
import java.util.Date;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 *
 * @author kiburu
 */
@Configuration
@Slf4j
public class LoadDatabase {
    @Bean
    CommandLineRunner initDatabase(InsuranceRepository insuranceRepository) {

        return args -> {
            Optional<Insurance> insu = insuranceRepository.findByName("GoldPlan Insurances");
            if(!insu.isPresent()){
                Insurance insurance = new Insurance();
                insurance.setName("GoldPlan Insurances");
                insurance.setEmail("goldplaninsurances@gmail.com");
                insurance.setPhoneNumber("254728506150");
                insurance.setPaybill("25472");
                insurance.setTimeCreated(new Date());
                insurance.setTimeUpdated(new Date());
                insuranceRepository.save(insurance);
               
                log.info("Preloading default insurances 1");
            }
            
             Optional<Insurance> insu2 = insuranceRepository.findByName("Pivotal Insurances");
            if(!insu2.isPresent()){
                Insurance insurance2 = new Insurance();
                insurance2.setName("Pivotal Insurances");
                insurance2.setEmail("pivotal@gmail.com");
                insurance2.setPhoneNumber("254728506151");
                insurance2.setPaybill("506150");
                insurance2.setTimeCreated(new Date());
                insurance2.setTimeUpdated(new Date());
                insuranceRepository.save(insurance2);
               
                log.info("Preloading default insurances 2");
            }
            
                            

      };
    }
}
