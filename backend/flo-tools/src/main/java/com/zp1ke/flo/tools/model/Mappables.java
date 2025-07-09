package com.zp1ke.flo.tools.model;

import jakarta.annotation.Nonnull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Mappables {

    private final Map<String, List<? extends Mappable>> map = new HashMap<>();

    /**
     * Adds a mappable to the collection.
     *
     * @param key   the key for the mappable
     * @param value the list of mappables to add
     */
    public void put(@Nonnull String key, @Nonnull List<? extends Mappable> value) {
        map.put(key, value);
    }

    /**
     * Returns a Set view of the keys contained.
     *
     * @return a Set view of the keys contained in this map.
     */
    @Nonnull
    public Set<String> keySet() {
        return map.keySet();
    }

    /**
     * Returns the list of mappables associated with the specified key.
     *
     * @param key the key whose associated list of mappables is to be returned
     * @return the list of mappables associated with the specified key, or an empty list if no mapping exists
     */
    @Nonnull
    public List<? extends Mappable> get(@Nonnull String key) {
        if (map.containsKey(key)) {
            return map.get(key);
        }
        return List.of();
    }
}
