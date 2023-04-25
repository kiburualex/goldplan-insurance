package com.dexni.goldplan.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.EXPECTATION_FAILED)
public class ExpectationFailedException extends RuntimeException {
    public ExpectationFailedException(String message) {
        super(message);
    }

    public ExpectationFailedException(String message, Throwable cause) {
        super(message, cause);
    }

    public ExpectationFailedException(Throwable cause) {
        super(cause);
    }

    protected ExpectationFailedException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
