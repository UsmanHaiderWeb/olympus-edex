/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    Input
} from "@/components/ui/input"
import {
    Button
} from "@/components/ui/button"
import {
    Checkbox
} from "@/components/ui/checkbox"
import {
    Label
} from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { memo } from "react"

const listingSchema = z.object({
    baseSymbol: z.string().min(1, "Base Symbol is required"),
    pairSymbol: z.string().min(1, "Pair Symbol is required"),
    basePair: z.string().min(1, "Base Pair is required"),
    startingPrice: z.string().min(1, "Starting Price is required"),
    image: z.any().optional(),
    enableMM: z.boolean().optional(),
    liquiditySpread: z.string().optional(),
    desiredVolume: z.string().optional(),
    positiveSpread: z.string().optional(),
    negativeSpread: z.string().optional(),
    adminWallet: z.string().min(1, "Admin Wallet is required")
})

function TokenListing() {
    const navigate = useNavigate()

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(listingSchema),
        defaultValues: {
            enableMM: true
        }
    })

    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData()

            // Example POST request
            const res = await fetch("/api/token-listing", {
                method: "POST",
                body: formData
            })

            if (!res.ok) throw new Error("Failed to submit token listing.")
            return res.json()
        },
        onSuccess: () => {
            alert("Token listing submitted successfully!")
            navigate("/") // Go back to home or another page
        },
        onError: (error) => {
            alert(error.message)
        }
    })

    const onSubmit = (data: any) => {
        mutation.mutate(data)
    }

    return (
        <div className="min-h-screen bg-muted p-6 flex flex-col items-center justify-center">
            <div className="bg-black text-white text-3xl px-6 py-3 font-bold rounded mb-6 shadow-lg">
                COMING SOON
            </div>

            <Card className="w-full max-w-xl shadow">
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-2">Token Listing</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Token Listing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Token Listing:</Label>
                                <Input placeholder="Base Symbol (e.g. SOL)" {...register("baseSymbol")} />
                                {errors.baseSymbol && <p className="text-sm text-red-500">{errors.baseSymbol.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label>&nbsp;</Label>
                                <Input placeholder="Pair Symbol (e.g. USDT)" {...register("pairSymbol")} />
                                {errors.pairSymbol && <p className="text-sm text-red-500">{errors.pairSymbol.message}</p>}
                            </div>
                        </div>

                        {/* Base Pair */}
                        <div className="space-y-1">
                            <Label>Base Pair:</Label>
                            <Input placeholder="Enter Base Pair" {...register("basePair")} />
                            {errors.basePair && <p className="text-sm text-red-500">{errors.basePair.message}</p>}
                        </div>

                        {/* Starting Price */}
                        <div className="space-y-1">
                            <Label>Starting Price:</Label>
                            <Input placeholder="Enter Starting Price" {...register("startingPrice")} />
                            {errors.startingPrice && <p className="text-sm text-red-500">{errors.startingPrice.message}</p>}
                        </div>

                        {/* Upload Logo */}
                        <div className="space-y-1">
                            <Label>Logo (Upload Image):</Label>
                            <Input type="file" {...register("image")} />
                        </div>

                        {/* Market Making Settings */}
                        <div className="pt-4 space-y-2">
                            <Controller
                                name="enableMM"
                                control={control}
                                render={({ field }) => (<>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                field.onChange(checked);
                                            }}
                                            required
                                        />
                                        <Label className="font-semibold">Enable Market Making</Label>
                                    </div>
                                    <>
                                        <div className="space-y-1">
                                            <Label>Liquidity Spread:</Label>
                                            <Input placeholder="Enter Amount" {...register("liquiditySpread")} disabled={!field.value} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Desired Volume:</Label>
                                            <Input placeholder="Enter Desired Volume" {...register("desiredVolume")} disabled={!field.value} />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label>Desired Spread (Positive +):</Label>
                                                <Input placeholder="Positive (+)" {...register("positiveSpread")} disabled={!field.value} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Desired Spread (Negative -):</Label>
                                                <Input placeholder="Negative (-)" {...register("negativeSpread")} disabled={!field.value} />
                                            </div>
                                        </div>
                                    </>
                                </>)}
                            />

                        </div>

                        {/* Admin Wallet */}
                        <div className="pt-3">
                            <Label>Admin Wallet:</Label>
                            <Input placeholder="Enter Admin Wallet Address" {...register("adminWallet")} />
                            {errors.adminWallet && <p className="text-sm text-red-500">{errors.adminWallet.message}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 pt-4">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Saving..." : "Save Settings"}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => navigate("/")}>
                                Go Back
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}


export default memo(TokenListing);