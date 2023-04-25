/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author kiburu
 */
@Slf4j
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RequestMapper {
    String startDate;
    String endDate;
    String search;
    Integer noPagination = 0;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortBy = "id";
    
    public RequestFilterMapper toFilterDTO(){
        RequestFilterMapper filterMapper = new RequestFilterMapper();
        filterMapper.setSearch(search);
        filterMapper.setNoPagination(noPagination);
        filterMapper.setPageNumber(pageNumber);
        filterMapper.setPageSize(pageSize);
        filterMapper.setSortBy(sortBy);
        filterMapper.setStrStartDate(startDate);
        filterMapper.setStrEndDate(endDate);
        
        if (startDate != null && !startDate.equals("null") && !startDate.isEmpty()) {
            filterMapper.setStrStartDate(startDate);
        }else{
            // set default as 1900-01-01 to allow fetching all data since jpa doesn't allow (CASE WHEN to select a condition but a value)
            filterMapper.setStrStartDate("1900-01-01");
        }

        if (endDate != null  && !endDate.equals("null") && !endDate.isEmpty()) {
            try{
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                Calendar c = Calendar.getInstance();
                c.setTime(sdf.parse(endDate));
                c.add(Calendar.DATE, 1);  // number of days to add
                endDate = sdf.format(c.getTime());
                filterMapper.setStrEndDate(endDate);
            }catch(ParseException ex){
                log.error("Error converting date time", ex);
            }
        }else{
            // set default to current date
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            c.add(Calendar.DATE, 1);  // number of days to add
            endDate = sdf.format(c.getTime());
            filterMapper.setStrEndDate(endDate);
        }
        
        return filterMapper;
            
    }
}
