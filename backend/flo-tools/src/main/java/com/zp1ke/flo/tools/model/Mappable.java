package com.zp1ke.flo.tools.model;

import jakarta.annotation.Nonnull;
import java.util.List;

public interface Mappable {

    /**
     * Returns the mappable's properties names.
     *
     * @return a list of property names
     */
    @Nonnull
    List<String> getProperties();

    /**
     * Returns the mappable's value of given property.
     *
     * @param property the property name to get the value for
     * @return the value of the specified property
     */
    String getValue(@Nonnull String property);
}
