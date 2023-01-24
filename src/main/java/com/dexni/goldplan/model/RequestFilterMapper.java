/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.dexni.goldplan.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author kiburu
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RequestFilterMapper {
    String strStartDate;
    String strEndDate;
    String search;
    Integer noPagination = 0;
    Integer pageNumber = 0;
    Integer pageSize = 10;
    String sortBy = "id";
}
