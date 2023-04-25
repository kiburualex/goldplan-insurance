package com.dexni.goldplan.dto;

import com.dexni.goldplan.entity.User;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class UserDTOMapper implements Function<User, UserDTO> {
    @Override
    public UserDTO apply(User user) {
        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getAvatarContent(),
                user.getAvatarContentType(),
                user.getTimeCreated(),
                user.getTimeUpdated(),
                user.getStatus()
        );
    }
}
