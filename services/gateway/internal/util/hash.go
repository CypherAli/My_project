package util

import (
	"hash/fnv"
)

// HashStringToInt64 converts a string (like UUID) to int64 for legacy compatibility
func HashStringToInt64(s string) int64 {
	h := fnv.New64a()
	h.Write([]byte(s))
	return int64(h.Sum64())
}

// HashStringToInt32 converts a string to int32
func HashStringToInt32(s string) int32 {
	return int32(HashStringToInt64(s))
}
