package com.swadExpress.service.impl;

import com.swadExpress.config.JwtProvider;
import com.swadExpress.entity.User;
import com.swadExpress.exception.ApiException;
import com.swadExpress.repository.UserRepository;
import com.swadExpress.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {

        String email=jwtProvider.getEmailFromJwtToken(jwt);
        User user=findUserByEmail(email);

        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {

        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new ApiException(HttpStatus.NOT_FOUND, "Your account could not be found.");
        }

        return user;
    }
}
